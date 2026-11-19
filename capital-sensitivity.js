(function () {
  'use strict';
  const rows = window.CapitalSensitivity;
  const technology = document.querySelector('#capital-technology');
  const regions = ['China', 'Europe', 'Middle East'];
  const fuels = [
    { name: 'Coal', color: '#677c80' },
    { name: 'Gas', color: '#286653' },
    { name: 'Oil', color: '#a16a42' },
  ];
  const signed = value => (value < 0 ? '−' : '+') + Math.abs(value).toFixed(3);

  function render() {
    const selected = rows.filter(row => row.technology === technology.value);
    const largest = selected.reduce((a, b) => Math.abs(a.deltaBp) > Math.abs(b.deltaBp) ? a : b);
    const maximum = Math.max(...selected.map(row => Math.abs(row.deltaBp)));
    const limit = [0.5, 1, 2, 5, 10, 25, 50, 100, 250].find(value => value >= maximum);
    const x = value => 152 + value / limit * 88;
    const label = technology.selectedOptions[0].textContent;
    const location = largest.region === 'Middle East' ? 'the Middle East' : largest.region;

    document.querySelector('#capital-region-charts').innerHTML = regions.map(region => {
      const regional = selected.filter(row => row.region === region);
      const description = fuels.map(fuel => {
        const row = regional.find(item => item.fuel === fuel.name);
        return `${fuel.name}: ${signed(row.deltaBp)} basis points`;
      }).join('; ');
      const marks = fuels.map((fuel, index) => {
        const row = regional.find(item => item.fuel === fuel.name);
        const y = 43 + index * 48;
        return `<g data-fuel="${fuel.name}" data-delta-bp="${row.deltaBp}">
          <text x="0" y="${y + 4}" class="capital-fuel-label">${fuel.name}</text>
          <line x1="64" x2="240" y1="${y}" y2="${y}" class="capital-track"/>
          <line x1="152" x2="${x(row.deltaBp)}" y1="${y}" y2="${y}" stroke="${fuel.color}" stroke-width="7"/>
          <circle cx="${x(row.deltaBp)}" cy="${y}" r="3.5" fill="${fuel.color}"/>
          <text x="320" y="${y + 4}" text-anchor="end" class="capital-value">${signed(row.deltaBp)}</text>
        </g>`;
      }).join('');
      const ticks = [-limit, 0, limit].map(value => `<text x="${x(value)}" y="183" text-anchor="middle" class="capital-axis">${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value)}</text>`).join('');
      return `<article class="capital-region" data-region="${region}">
        <header><h4>${region}</h4><span>Panel mean WACC <b>${(regional[0].meanWacc * 100).toFixed(2)}%</b></span></header>
        <svg viewBox="0 0 320 202" role="img" aria-label="${label}, ${region}. ${description}. Shared axis from minus ${limit} to plus ${limit} basis points.">
          <title>${label} · ${region} · 10% fuel-price increase</title>
          <line x1="152" x2="152" y1="21" y2="158" class="capital-zero"/>
          ${marks}${ticks}
        </svg>
      </article>`;
    }).join('');

    document.querySelector('#capital-sensitivity-insight').textContent =
      `For ${label}, the largest response is in ${location}: a 10% ${largest.fuel.toLowerCase()}-price increase is associated with a ${Math.abs(largest.deltaBp).toFixed(2)} bp ${largest.deltaBp < 0 ? 'decrease' : 'increase'} in WACC.`;
  }
  technology.addEventListener('change', render);
  render();
})();
