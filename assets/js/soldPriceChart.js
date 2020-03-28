/*
TITLE directory --V
data.findCompletedItemsResponse[""0""].searchResult[""0""].item[""0""].title≠

bid amount directory --V
sellingStatus[""0""].currentPrice[""0""].__value__

Converted Current Price
sellingStatus[""0""].convertedCurrentPrice[""0""]

Directory of Ended With Sales?
items[i]['sellingStatus']["0"]['sellingState']["0"];

Date Sold
listingInfo[""0""].endTime

let whatever = ([listingInfo]["0"][endTime][0])
console.log whatever;
*/

function printSoldItems(items) {
    var dateAndPrice = {

    }

    for (const i in items) {
        console.log(items[i])
        var divTitle = document.createElement("a");
        divTitle.setAttribute('href', items[i]['viewItemURL']["0"]);
        var title = document.createTextNode("Title: " + items[i]['title']);
        divTitle.appendChild(title);


        var divImg = document.createElement("div");
        var img = document.createElement("img");
        img.src = items[i]['galleryURL'];
        divImg.appendChild(img);

        var divPrice = document.createElement("div");
        divPrice.setAttribute('class', 'price');
        var content = document.createTextNode("Sold for: " + items[i]['sellingStatus']["0"]['currentPrice']["0"].__value__);
        divPrice.appendChild(content);

        var divTime = document.createElement("div");
        divTime.setAttribute('class', 'date');
        var datetimeStr = String(items[i]["listingInfo"]["0"].endTime).split('T');
        var dateOfSale = document.createTextNode("Date Sold: " + datetimeStr[0]);
        divTime.appendChild(dateOfSale);

        /* initial Attempt ^
        var myJSON = JSON.stringify(dateOfSale);
        var dateOfSaleFormat = myJSON.split("T", 0);
        var dateSaleTextNode = document.createTextNode(dateOfSaleFormat);
        console.log(typeof(dateOfSaleFormat)); 
        */

        var divSeparator1 = document.createElement("br");
        var divSeparator2 = document.createElement("br");

        var parentDiv = document.getElementById("results");
        var refDiv = document.getElementById("items");
        parentDiv.insertBefore(divSeparator1, refDiv.nextSibling);
        parentDiv.insertBefore(divTime, refDiv.nextSibling);
        parentDiv.insertBefore(divTitle, refDiv.nextSibling);
        parentDiv.insertBefore(divPrice, refDiv.nextSibling);
        parentDiv.insertBefore(divImg, refDiv.nextSibling);

        let wasSold = items[i]['sellingStatus']["0"]['sellingState']["0"];
        console.log(wasSold);

        if (wasSold == "EndedWithSales") {
            var price = items[i]['sellingStatus'][0]['convertedCurrentPrice'][0].__value__
            var datetimeStr = String(items[i]["listingInfo"]["0"].endTime).split('T');
            // var dateOfSale = document.createTextNode(datetimeStr[0].trim());
            console.log(datetimeStr[0])
            // dateAndPrice.date = datetimeStr[0]
            // dateAndPrice.price = price

            dateAndPrice[datetimeStr[0]] = price
        }
    }

   
    const ctx = document.getElementById('lineChart').getContext('2d');
    var xlabels = [];
    var ylabels = [];
    
    const orderedDateAndPrice = {};
    Object.keys(dateAndPrice).sort().forEach(function(key) {
        orderedDateAndPrice[key] = dateAndPrice[key]; 
    });

    for (let [key, value] of Object.entries(orderedDateAndPrice)) {
        xlabels.push(key);
        ylabels.push(value);
    }
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: xlabels,
            datasets: [{
                fill: false,
                label: 'Sold History Chart',
                backgroundColor: 'rgb(77, 148, 255)',
                borderColor: 'rgb(77, 148, 255)',
                data: ylabels,
            }]
        },

        // Configuration options go here
        options: {}
    });

}


const fetchData = async () => {
    var keywords = document.getElementById("keywords").value.replace(' ', '+')


    const APP_ID = ""
    const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${keywords}`

    const api_call = await fetch(url, {
        headers: {

        }
    })
    const data = await api_call.json()
    return { data }
}

const resp_data = () => {
    fetchData().then((resp) => {
        console.log(resp)
        printSoldItems(resp['data']['findCompletedItemsResponse']["0"]['searchResult']["0"]["item"])
    })

    return false;
}



