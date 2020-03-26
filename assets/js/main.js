"use strict";

/*
    Issue: Access to fetch at 'https://api.ebay.com/identity/v1/oauth2/token' from origin 'http://127.0.0.1:5500' 
           has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 
           'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves 
           your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

    Solution: https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome
    
     To start this web app:
    1. Right click on this page -> "Open with Live Server"
    2. Open a new chrome browser with this command in the terminal:
       $ open -n -a "Google Chrome" --args --user-data-dir=/tmp/temp_chrome_user_data_dir http://127.0.0.1:5500/index.html --disable-web-security
    3. Execute the following command in a terminal to get a new access token
       $ node /Users/jfung/coding/ebay-oauth-client/client.js
    4. Copy and paste the access token into assets/js/main.js

*/

// const req = require('request');

function printItemSummaries(obj) {

    for (const i in obj) {
        var divTitle = document.createElement("a");
        divTitle.setAttribute('href', obj[i]['itemWebUrl']);
        var title = document.createTextNode("Title: " + obj[i]['title']);
        divTitle.appendChild(title);

        // var divThumbnail = document.createElement("img");
        // divThumbnail.src = obj[i]['image']['imageUrl'];
        // divTitle.appendChild(divThumbnail);

        var divImg = document.createElement("div");
        var img = document.createElement("img");
        img.src = obj[i]['image']['imageUrl'];
        divImg.appendChild(img);

        var divPrice = document.createElement("div");
        divPrice.setAttribute('class', 'price');
        var content = document.createTextNode("Price: " + obj[i]['price']['value']);
        divPrice.appendChild(content);

        var divCondition = document.createElement("div");
        divCondition.setAttribute('class', 'condition');
        var condition = document.createTextNode("Condition: " + obj[i]['condition']);
        divCondition.appendChild(condition);

        var divSeparator1 = document.createElement("br");
        var divSeparator2 = document.createElement("br");


        var parentDiv = document.getElementById("results");
        var refDiv = document.getElementById("items");
        parentDiv.insertBefore(divSeparator1, refDiv.nextSibling);
        parentDiv.insertBefore(divSeparator2, refDiv.nextSibling);
        parentDiv.insertBefore(divImg, refDiv.nextSibling);
        parentDiv.insertBefore(divCondition, refDiv.nextSibling);
        parentDiv.insertBefore(divPrice, refDiv.nextSibling);
        parentDiv.insertBefore(divTitle, refDiv.nextSibling);
    }
}

function setDefaultValues() {
    document.getElementById('lowest_price').value = 10
    document.getElementById('highest_price').value = 999
    document.getElementById('keywords').value = ('Steph Curry RC topps')
    document.getElementById('max_display').value = 5
}

window.onload = function() {
    this.setDefaultValues()
}


const fetchData = async () => {
    var keywords = document.getElementById("keywords").value.replace(' ', '+')
    var lowest_price = document.getElementById('lowest_price').value
    var highest_price = document.getElementById('highest_price').value
    var max_display = document.getElementById('max_display').value

    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${keywords}&filter=price:\[${lowest_price}..${highest_price}\]&filter=priceCurrency:USD&limit=${max_display}`
    const token = "v^1.1#i^1#r^0#I^3#p^1#f^0#t^H4sIAAAAAAAAAOVYf2wTVRxft3ZmmVNIdCAhpt5EkNHr/ei1vctaLS0bHfvFug1kUXy9e91ua++Oe69biyEZI5kajQnExWg0jpCIAgkh8isaAyZkiYkSVKIhRPEPNNMAOgn+IGC8a8voJtmQNbjE/tPc933f932+n8/3+967owZKy5YPrR76vcJyT/HIADVQbLHQ5VRZqa36vpLiRbYiKs/BMjLw6IB1sGSsBoFEXBNaIdJUBUF7KhFXkJAx+oikrggqQDISFJCASMCiEAk0NggMSQmarmJVVOOEPRzyEV7e5YGcREsUI0ZZiTasyo2YbaqPiHGQpfmo2ws5r5eDvDGOUBKGFYSBgn0EQzGUg2IdDNdGUwLjFlwekve4NxD2DqgjWVUMF5Ii/Bm4Qmaunod1eqgAIahjIwjhDwdqI82BcGhVU1uNMy+WP8dDBAOcRJOfgqoE7R0gnoTTL4My3kIkKYoQIcLpz64wOagQuAHmDuBnqGZFD8uJEojRXoZ3S66CUFmr6gmAp8dhWmTJEcu4ClDBMk7PxKjBRrQHijj31GSECIfs5t/aJIjLMRnqPmLVysBTgZYWwl+vwnpVgchRr3YrRoFJjpbWkEMSgScGIO9y8DTnoqM0lVsoGy1H85SVgqoiySZpyN6k4pXQQA2nckPncWM4NSvNeiCGTUT5fswEh+wGU9SsikncrZi6woRBhD3zOLMCE7Mx1uVoEsOJCFMHMhT5CKBpskRMHczUYq58UshHdGOsCU5nf38/2c+Sqt7lZCiKdq5vbIiI3TABCMPX7PWsvzzzBIecSUWExkwkCzitGVhSRq0aAJQuwu+iPDTnyfE+GZZ/qvUfhrycnZM7olAdYlQI7QWABRLNu2iJLUSH+HNF6jRxwChIOxJA74VYiwMROkSjzpIJqMuSwHIxhvXGoENy8zGHi4/FHFFOcjvoGIQUhNGoyHv/T41yu6UegaIOcUFqvWB13re+tivpapVXbgr2BgN1fXXt2pq1vcC5prbdW5tq9UY7GryRBhxL1SHf7XbDrZMXVQ22qHFZTBeAAbPXC8gCq0stQMfpCIzHDcOsEkVmonNLZHM+MgIATSbNxiZFNeFUgbGjm6aNGcSzyjmgaeFEIolBNA7DhdnN/6Od/JbpycZdZ07lZOiXFVKWspcUMqMmifpEUodITerG/YxsNs/sNrUXKsYOiHU1Hod6Bz1roe+2vmavz8DHvzws7iz3wt1U5lJti3HZKKGNcy2zu6KoDObYaUxzXo5mjTmz0zSY0bQtPdfOodUqwlCaLjVr3R1eq52TX/L9RZkfPWg5RA1aDhRbLJSTWkJXUY+UlrRbS+5dhGQMSRnESCR3Kca7qw7JXpjWgKwXl1q0dvDTkrzPCiNPUwsnPiyUldDleV8ZqMU3R2z0/QsqDEpYhqMpxu3ybKCqbo5a6UrrA6d+KK36rXP73jeSZ8ajwW3zTo51NlAVE04Wi63IOmgpIpYPnRuufOvc26F1z6/byo9ahl59cEdX+Tbbd/j40u69wXcu951aUbyz54v51/e8Ao8Pju7Yf2r46Ofpl48RfzaNa1dYTjnxcXnjsUPVifPfXvvysQuVh5d81jiiud/8+WJk3JeqPdHzUnWF/ZcegZz34rsLRmw1nV9d3Hdh8YFrV4OnL1WzVU9u5ndu3fLNC0rZc7/uPr/n6+HAp0eOpPCBk8f2c8uesdRuemhz1fdXHwaDnR9Ya57dsur193eFQq99RJypGHvi+ph2ZXPwMs8cHd61WhywLxxNHGy7QFw7wpD04Upb/cYfQ7v36d6zo5ce713x4dm/1LF1a5bP3zG6dPF7n4yX/3Hw4rLTWfn+BrbYSaXwEQAA"
    
    const api_call = await fetch(url, {
        headers: {
            "Authorization": 'Bearer ' + token,
        }
    })
    const data = await api_call.json()
    return {data}
}


const resp_data = () => {
    fetchData().then((resp) => {
        console.log(resp)
        printItemSummaries(resp['data']['itemSummaries'])
    })

    return false;
}

