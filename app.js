const currencyData = {
    EUR: {
        labels: [],
        data: [],
        color: 'rgb(0, 65, 255)'
    },
    USD: {
        labels: [],
        data: [],
        color: 'rgb(0, 179, 0)'
    }
}

const today = new Date()

const getRatesForDate = (date, id) => {
    let URL = `https://www.bnm.md/ro/official_exchange_rates?get_xml=1&date=${date}`

    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL);
    xhr.send();
    xhr.onload = () => {
        let result = xhr.responseText
        localStorage.setItem(date, result)
        //XML Parse
        let xmlParse = new DOMParser()
        let xmlDoc = xmlParse.parseFromString(result, 'text/xml')
        let value = parseFloat(xmlDoc.querySelector(`[ID="${id}"]`).lastElementChild.innerHTML)
        let currency = xmlDoc.querySelector(`[ID="${id}"]`).children[1].innerHTML
            currencyData[currency].data.push(value)
            currencyData[currency].labels.push(date)
    }
}

const getData = (id) => {
    let month = today.toLocaleDateString('ro').substring(3,5)
    let year  = today.getFullYear()
    for(let day = 1; day <= today.getDate(); day++) {
        if(day < 10)
        day = '0' + day
        
        getRatesForDate(`${day}.${month}.${year}`, id)                
    }
}
getData(47) //euro
getData(44)  //usd

const plotData = (element, currency, color) => {
    const data = {
        labels: currencyData[currency].labels,
        datasets: [{
        label: `${currency} / MDL`,
        // backgroundColor: 'rgb(255, 99, 132)',
        // borderColor: 'rgb(255, 99, 132)',
        backgroundColor: color,
        borderColor: color,
        data: currencyData[currency].data,
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const exchangeChart = new Chart(
        document.getElementById(element), config);
}
const chartDraw = () => {
    for(let key in currencyData){
        plotData([`${key}Chart`],key, currencyData[key].color)
    }
}

setTimeout(chartDraw,2000)