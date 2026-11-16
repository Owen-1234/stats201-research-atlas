from pathlib import Path
import xml.etree.ElementTree as ET
import math,json,html
import argparse,gzip
parser=argparse.ArgumentParser(description='Render the bundled Shanghai OSM extract as a local SVG map.')
parser.add_argument('--source',type=Path,default=Path(__file__).resolve().parents[1]/'assets/shanghai-osm-source.xml.gz')
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'assets')
args=parser.parse_args();root=args.output;root.mkdir(parents=True,exist_ok=True)
src=args.source
with (gzip.open(src,'rb') if src.suffix=='.gz' else src.open('rb')) as handle:tree=ET.parse(handle).getroot()
nodes={n.attrib['id']:(float(n.attrib['lon']),float(n.attrib['lat'])) for n in tree.findall('node')}
ways={w.attrib['id']:{'id':w.attrib['id'],'nodes':[n.attrib['ref'] for n in w.findall('nd')],'tags':{t.attrib['k']:t.attrib['v'] for t in w.findall('tag')}} for w in tree.findall('way')}
bounds=[121.481,31.226,121.516,31.248];W,H=880,650
merc=lambda lat:math.log(math.tan(math.pi/4+math.radians(lat)/2))
minx,maxx=map(math.radians,[bounds[0],bounds[2]]);miny,maxy=merc(bounds[1]),merc(bounds[3]);scale=min(W/(maxx-minx),H/(maxy-miny));offsetX=(W-(maxx-minx)*scale)/2;offsetY=(H-(maxy-miny)*scale)/2
project=lambda p:[round(offsetX+(math.radians(p[0])-minx)*scale,2),round(H-offsetY-(merc(p[1])-miny)*scale,2)]
def coords(w):return [nodes[n] for n in w['nodes'] if n in nodes]
def path(points,closed=False):
 if len(points)<2:return ''
 out='M'+' '.join(f'{x},{y}' for x,y in map(project,points));return out+('Z' if closed else '')
water=[];parks=[];buildings=[];roads=[]
for w in ways.values():
 t=w['tags'];pts=coords(w)
 if not pts:continue
 if t.get('natural')=='water' or t.get('waterway')=='riverbank':water.append(pts)
 elif t.get('leisure') in ['park','garden'] or t.get('landuse') in ['forest','grass','recreation_ground']:parks.append(pts)
 elif 'building' in t:buildings.append(pts)
 elif 'highway' in t and t['highway'] not in ['proposed','construction','steps']:roads.append((pts,t))
# Join the river bank relation's outer segments, including geometry from member ways.
for rel in tree.findall('relation'):
 t={v.attrib['k']:v.attrib['v'] for v in rel.findall('tag')}
 if not(t.get('natural')=='water' or t.get('waterway')=='riverbank'):continue
 segs=[list(ways[m.attrib['ref']]['nodes']) for m in rel.findall('member') if m.attrib.get('type')=='way' and m.attrib.get('role','outer') in ['outer',''] and m.attrib['ref'] in ways]
 while segs:
  ring=segs.pop(0);changed=True
  while changed and ring[0]!=ring[-1]:
   changed=False
   for i,seg in enumerate(segs):
    if ring[-1]==seg[0]:ring+=seg[1:]
    elif ring[-1]==seg[-1]:ring+=list(reversed(seg[:-1]))
    elif ring[0]==seg[-1]:ring=seg[:-1]+ring
    elif ring[0]==seg[0]:ring=list(reversed(seg[1:]))+ring
    else:continue
    segs.pop(i);changed=True;break
  if len(ring)>3 and ring[0]==ring[-1]:water.append([nodes[n] for n in ring if n in nodes])
print('OSM features:',len(nodes),'nodes',len(ways),'ways',len(roads),'roads',len(buildings),'buildings',len(water),'water polygons')
# All paths share a faithful Web Mercator projection, with a small aspect-preserving margin.
svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><title>OpenStreetMap-derived local map of central Shanghai</title><desc>Roads, building footprints, parks, and water from OpenStreetMap. © OpenStreetMap contributors, ODbL 1.0.</desc><rect width="880" height="650" fill="#f2f0e6"/>']
svg+=['<path d="'+path(p,True)+'" fill="#dfe7d3"/>' for p in parks if len(p)>2]
svg+=['<path d="'+path(p,True)+'" fill="#c6dadd" stroke="#b3cbd0" stroke-width=".6"/>' for p in water if len(p)>2]
svg+=['<path d="'+path(p,True)+'" fill="#e0ded2" stroke="#d0cfc2" stroke-width=".35"/>' for p in buildings if len(p)>2]
widths={'motorway':4.4,'trunk':3.8,'primary':3.6,'secondary':2.7,'tertiary':2.0,'residential':1.5,'unclassified':1.3,'service':.8,'pedestrian':1.6,'footway':.6,'cycleway':.6,'path':.5}
for pts,t in roads:
 width=widths.get(t['highway'],1);tunnel=t.get('tunnel') not in [None,'no'];color='#c5cfca' if tunnel else '#d4bfa2' if t['highway'] in ['motorway','trunk','primary'] else '#d7d6cb'
 svg.append(f'<path d="{path(pts)}" fill="none" stroke="{color}" stroke-width="{width+1}" stroke-linecap="round" stroke-linejoin="round" '+('stroke-dasharray="3 3"' if tunnel else '')+'/>')
for pts,t in roads:
 width=widths.get(t['highway'],1);tunnel=t.get('tunnel') not in [None,'no'];color='#e5e9df' if tunnel else '#f8f7ed' if t['highway'] not in ['motorway','trunk'] else '#e4d5b6'
 svg.append(f'<path d="{path(pts)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" '+('stroke-dasharray="3 3"' if tunnel else '')+'/>')
# Named landmarks are cartographic annotations at known OSM-derived positions where available.
landmarks=[]
for n in tree.findall('node'):
 t={v.attrib['k']:v.attrib['v'] for v in n.findall('tag')}
 en=t.get('name:en','')
 if en in ['Oriental Pearl Tower','Shanghai Tower','Shanghai World Financial Center','The Bund','Shanghai International Convention Center']:
  landmarks.append([en,project(nodes[n.attrib['id']])])
labels=[['THE BUND',121.4858,31.2375,13,0],['LUJIAZUI',121.513,31.2348,15,0],['HONGKOU',121.493,31.2474,14,0],['HUANGPU',121.481,31.2235,14,0],['Huangpu River',121.500,31.233,14,-54],['Nanjing Road E.',121.4818,31.2393,8,-9],['Pudong Avenue',121.512,31.244,8,10]]
for text,lon,lat,size,angle in labels:
 x,y=project([lon,lat]);svg.append(f'<text x="{x}" y="{y}" fill="'+('#7f9fa7' if 'River' in text else '#909a90')+f'" font-family="Georgia,serif" font-size="{size}" letter-spacing="'+('2' if text.isupper() else '.1')+f'" text-anchor="middle" transform="rotate({angle} {x} {y})" style="paint-order:stroke;stroke:#f2f0e6;stroke-width:1.8px">{html.escape(text)}</text>')
svg.append('</svg>');(root/'shanghai-basemap.svg').write_text(''.join(svg))
meta={'bounds':bounds,'width':W,'height':H,'projection':{'minx':minx,'miny':miny,'scale':scale,'offsetX':offsetX,'offsetY':offsetY},'water':[[project(p) for p in poly] for poly in water],'attribution':'© OpenStreetMap contributors','source':'https://api.openstreetmap.org/api/0.6/map?bbox=121.481,31.226,121.516,31.248','license':'ODbL-1.0'}
(root/'shanghai-map.js').write_text('window.ShanghaiAtlasMap='+json.dumps(meta,separators=(',',':'))+';\n')
features=[]
for w in ways.values():
 pts=coords(w)
 if len(pts)<2 or not w['tags']:continue
 closed=w['nodes'][0]==w['nodes'][-1]
 features.append({'type':'Feature','id':'way/'+w['id'],'properties':w['tags'],'geometry':{'type':'Polygon' if closed and 'highway' not in w['tags'] else 'LineString','coordinates':[pts] if closed and 'highway' not in w['tags'] else pts}})
(root/'shanghai-osm.geojson').write_text(json.dumps({'type':'FeatureCollection','license':'ODbL-1.0','copyright':'© OpenStreetMap contributors','source':meta['source'],'features':features},ensure_ascii=False,separators=(',',':')))
(root/'shanghai-map-LICENSE.txt').write_text('Shanghai map data: © OpenStreetMap contributors.\nOpen Database License (ODbL) 1.0: https://opendatacommons.org/licenses/odbl/1-0/\nAttribution and copyright: https://www.openstreetmap.org/copyright\nThe accompanying shanghai-osm.geojson is an extract of OSM ways; derived data remains under ODbL 1.0. The SVG is a Produced Work rendered from this extract.\nDownloaded 2026-11-17 from '+meta['source']+'\n')
