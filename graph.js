//第5章：グラフを表示
function createPieChart(rows) {
  let pieChartData = {};

  let category = '';
  rows.forEach(function (data) {
    category = data.category;
    if (category != '収入') {
      if (pieChartData[category] === undefined) {
        pieChartData[category] = Number(data.amount);
      } else {
        pieChartData[category] += Number(data.amount);
      }
    }
  });

  let keyArray = [];
  let valueArray = [];
  for (key in pieChartData) {
    keyArray.push(key);
    valueArray.push(pieChartData[key]);
  }

  let pieChart = document.getElementById('pieChart');
  new Chart(pieChart, {
    type: 'pie',
    data: {
      labels: keyArray,
      datasets: [
        {
          backgroundColor: [
            '#EB5757',
            '#6FCF97',
            '#56CCF2',
            '#F2994A',
            '#F2C94C',
            '#2F80ED',
            '#9B51E0',
            '#BB6BD9',
          ],
          data: valueArray,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'カテゴリ毎の支出割合',
      },
    },
  });
}
