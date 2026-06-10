/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08181818181818182, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.058823529411764705, 500, 1500, "Create Agreement Intercab PA-PO Proceed"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "Costing Delete"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "Product Delete Instance"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "Costing Get Exception"], "isController": false}, {"data": [0.15625, 500, 1500, "Create Agreement Intercab PO-PA Closed Won"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "Costing Create Exception"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "Costing Edit Group Copy"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "Product Delete"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "Create Agreement Intercab PA-PO Closed Won"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PO-PO"], "isController": false}, {"data": [0.0, 500, 1500, "Create Pricing"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PA-PA"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "Product Get Instance"], "isController": false}, {"data": [0.1875, 500, 1500, "Create Agreement Intercab PO-PA Proceed"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "Create Costing Instance Group"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "Product Create"], "isController": false}, {"data": [0.0, 500, 1500, "Product Create Single Instance"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PO-PA"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "Create Agreement Intercab PA-PA Proceed"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "Delete Pricing"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PA-PO"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "Create Agreement Intercab PO-PO Closed Won"], "isController": false}, {"data": [0.0, 500, 1500, "CreateCosting"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "Create Agreement Intercab PA-PA Closed Won"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "Create Agreement Intercab PO-PO Proceed"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "Costing Get List-Group Copy"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 440, 0, 0.0, 2047.722727272725, 420, 4937, 1918.0, 2792.9000000000005, 3329.749999999999, 4569.369999999999, 0.48768755188607615, 20.25325185071884, 1.7346083747729204], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Agreement Intercab PA-PO Proceed", 17, 0, 0.0, 1863.823529411765, 1166, 2797, 1879.0, 2228.9999999999995, 2797.0, 2797.0, 0.01995820517034915, 0.015416933876705253, 0.04299589902909202], "isController": false}, {"data": ["Costing Delete", 17, 0, 0.0, 1889.1176470588236, 1190, 2964, 1914.0, 2387.9999999999995, 2964.0, 2964.0, 0.01996218926503916, 0.027370032937612285, 0.041815328099129884], "isController": false}, {"data": ["Product Delete Instance", 17, 0, 0.0, 1837.4705882352944, 1072, 2888, 1821.0, 2443.9999999999995, 2888.0, 2888.0, 0.019971616808112706, 0.015427293842985499, 0.04224465039684778], "isController": false}, {"data": ["Costing Get Exception", 17, 0, 0.0, 1864.1176470588236, 1161, 3168, 1911.0, 2450.399999999999, 3168.0, 3168.0, 0.019953824502592234, 0.02346133271593853, 0.04166140311185762], "isController": false}, {"data": ["Create Agreement Intercab PO-PA Closed Won", 16, 0, 0.0, 1686.0625, 1125, 2043, 1864.5, 2039.5, 2043.0, 2043.0, 0.020080069276239003, 0.015511069138188527, 0.043513353246068705], "isController": false}, {"data": ["Costing Create Exception", 17, 0, 0.0, 1922.2941176470588, 1179, 3019, 1882.0, 2928.6, 3019.0, 3019.0, 0.019947526272065485, 0.015973605022552437, 0.05526477737680643], "isController": false}, {"data": ["Costing Edit Group Copy", 17, 0, 0.0, 1842.8823529411766, 1102, 2239, 1905.0, 2117.4, 2239.0, 2239.0, 0.019945490148687763, 0.015874584444512233, 0.043708671771147796], "isController": false}, {"data": ["Product Delete", 17, 0, 0.0, 1880.1176470588236, 1078, 3215, 1869.0, 2405.399999999999, 3215.0, 3215.0, 0.019972907338633595, 0.016052444081733837, 0.04183777953258697], "isController": false}, {"data": ["Create Agreement Intercab PA-PO Closed Won", 17, 0, 0.0, 1922.3529411764705, 1126, 3653, 1874.0, 2988.9999999999995, 3653.0, 3653.0, 0.01997659213439311, 0.01543113708818843, 0.043308627478860065], "isController": false}, {"data": ["Create Agreement Intercab PO-PO", 17, 0, 0.0, 2429.7647058823527, 1765, 4655, 2431.0, 3703.7999999999993, 4655.0, 4655.0, 0.01998481154322715, 0.09336654142851433, 0.16231804453615253], "isController": false}, {"data": ["Create Pricing", 17, 0, 0.0, 2157.764705882353, 2017, 2452, 2133.0, 2308.7999999999997, 2452.0, 2452.0, 0.019968942421316496, 0.04693871524229375, 0.07997327428693256], "isController": false}, {"data": ["Create Agreement Intercab PA-PA", 17, 0, 0.0, 2507.705882352941, 1895, 3571, 2558.0, 2966.9999999999995, 3571.0, 3571.0, 0.01998013739282713, 0.12267101932490641, 0.21379137247383484], "isController": false}, {"data": ["Product Get Instance", 17, 0, 0.0, 1173.5294117647059, 420, 1619, 1209.0, 1540.6, 1619.0, 1619.0, 0.019967277156377843, 0.046368174347804124, 0.04291794630975354], "isController": false}, {"data": ["Create Agreement Intercab PO-PA Proceed", 16, 0, 0.0, 1672.5000000000002, 1077, 2392, 1838.0, 2221.2000000000003, 2392.0, 2392.0, 0.0200801952798991, 0.015511166471093933, 0.04321948280947033], "isController": false}, {"data": ["Create Costing Instance Group", 17, 0, 0.0, 1929.6470588235295, 1116, 2928, 1901.0, 2583.2, 2928.0, 2928.0, 0.019907139051366273, 0.014735948633726206, 0.04786267221139039], "isController": false}, {"data": ["Product Create", 17, 0, 0.0, 1932.0, 1415, 2200, 1920.0, 2124.7999999999997, 2200.0, 2200.0, 0.01994591138148902, 0.07084190078669021, 0.09791806300268097], "isController": false}, {"data": ["Product Create Single Instance", 17, 0, 0.0, 4188.588235294117, 3097, 4937, 4298.0, 4663.4, 4937.0, 4937.0, 0.019906486352932632, 20.457284696347042, 0.07435772490231184], "isController": false}, {"data": ["Create Agreement Intercab PO-PA", 17, 0, 0.0, 2503.705882352941, 1752, 3726, 2533.0, 2944.399999999999, 3726.0, 3726.0, 0.020004824693014196, 0.10494718579186746, 0.18367711109738233], "isController": false}, {"data": ["Create Agreement Intercab PA-PA Proceed", 17, 0, 0.0, 1955.1764705882354, 1161, 2971, 1871.0, 2578.2, 2971.0, 2971.0, 0.02000263564140216, 0.015451254680028427, 0.043052547806299184], "isController": false}, {"data": ["Delete Pricing", 17, 0, 0.0, 1878.2941176470586, 1230, 2753, 1943.0, 2524.2, 2753.0, 2753.0, 0.019973400130649535, 0.04694919347116546, 0.04181930652354747], "isController": false}, {"data": ["Create Agreement Intercab PA-PO", 17, 0, 0.0, 2596.294117647059, 1833, 3010, 2736.0, 2958.8, 3010.0, 3010.0, 0.019937443339545217, 0.11109673017133301, 0.1921120638977467], "isController": false}, {"data": ["Create Agreement Intercab PO-PO Closed Won", 17, 0, 0.0, 1811.5882352941173, 1157, 2050, 1912.0, 2040.4, 2050.0, 2050.0, 0.020018181218706875, 0.015463263031247204, 0.04339879131399342], "isController": false}, {"data": ["CreateCosting", 17, 0, 0.0, 2218.176470588235, 1906, 3684, 1998.0, 3071.1999999999994, 3684.0, 3684.0, 0.019865081043687987, 0.028187463629373678, 0.05226223469892132], "isController": false}, {"data": ["Create Agreement Intercab PA-PA Closed Won", 17, 0, 0.0, 1818.5882352941176, 1117, 3043, 1880.0, 2290.999999999999, 3043.0, 3043.0, 0.01998213362170295, 0.01543541767067093, 0.04332064125017631], "isController": false}, {"data": ["Create Agreement Intercab PO-PO Proceed", 17, 0, 0.0, 1813.4705882352941, 1141, 2707, 1884.0, 2225.3999999999996, 2707.0, 2707.0, 0.020017002677568476, 0.015462352654254555, 0.04308347060679777], "isController": false}, {"data": ["Costing Get List-Group Copy", 17, 0, 0.0, 1902.4117647058822, 1113, 3168, 1866.0, 2483.1999999999994, 3168.0, 3168.0, 0.01991625799286295, 0.020519191584443763, 0.041991407232999135], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 440, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
