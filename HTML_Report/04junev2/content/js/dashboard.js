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

    var data = {"OkPercent": 99.81510015408321, "KoPercent": 0.18489984591679506};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25439137134052386, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24722222222222223, 500, 1500, "Delete Product Instance"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "Delete Costing "], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "Create Agreement Intercab PA-PO Proceed"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "Create Aggrement Freight Calculation_PA-PO"], "isController": false}, {"data": [0.3251366120218579, 500, 1500, "Costing Get Exception"], "isController": false}, {"data": [0.0, 500, 1500, "Create Product Single Instance"], "isController": false}, {"data": [0.24, 500, 1500, "Create Agreement Intercab PO-PA Closed Won"], "isController": false}, {"data": [0.17307692307692307, 500, 1500, "Create Aggrement Characteristics_PO-PO"], "isController": false}, {"data": [0.3027027027027027, 500, 1500, "Create Costing"], "isController": false}, {"data": [0.3251366120218579, 500, 1500, "Costing Create Exception"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "Create Aggrement Freight Calculation_PA-PA"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "Costing Edit Group Copy"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "Create Agreement Characteristics Intercab PO-PA"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "Create Agreement Characteristics Intercab PA-PA"], "isController": false}, {"data": [0.25274725274725274, 500, 1500, "Create Product"], "isController": false}, {"data": [0.28, 500, 1500, "Create Aggrement Freight Calculation_PO-PA"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "Create Agreement Intercab PA-PO Closed Won"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PO-PO"], "isController": false}, {"data": [0.1, 500, 1500, "Create Pricing"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PA-PA"], "isController": false}, {"data": [0.2, 500, 1500, "Create Agreement Intercab PO-PA Proceed"], "isController": false}, {"data": [0.33152173913043476, 500, 1500, "Create Costing Instance Group"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "Create Agreement Characteristics Intercab PA-PO"], "isController": false}, {"data": [0.7138888888888889, 500, 1500, "Get Product Instance"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "Create Aggrement Freight Calculation_PO-PO"], "isController": false}, {"data": [0.20604395604395603, 500, 1500, "Agreement Creatiom Corporatesearch"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PO-PA"], "isController": false}, {"data": [0.1346153846153846, 500, 1500, "Create Agreement Intercab PA-PA Proceed"], "isController": false}, {"data": [0.125, 500, 1500, "Delete Pricing"], "isController": false}, {"data": [0.0, 500, 1500, "Create Agreement Intercab PA-PO"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "Create Agreement Intercab PO-PO Closed Won"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "Create Agreement Intercab PA-PA Closed Won"], "isController": false}, {"data": [0.24722222222222223, 500, 1500, " Delete Product"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "Create Agreement Intercab PO-PO Proceed"], "isController": false}, {"data": [0.25271739130434784, 500, 1500, "Costing Get List-Group Copy"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3245, 6, 0.18489984591679506, 1635.921725731894, 395, 18559, 1656.0, 2165.2000000000003, 2930.8999999999987, 4261.54, 3.5990572577291005, 210.3796508907528, 9.653854152225149], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Product Instance", 180, 0, 0.0, 1398.3444444444444, 900, 3134, 1586.5, 1800.4, 1888.55, 2925.8299999999995, 0.20647482096912398, 0.15949373377595416, 0.43512955434704054], "isController": false}, {"data": ["Delete Costing ", 182, 0, 0.0, 1491.2527472527472, 1020, 6379, 1285.0, 1952.0000000000002, 2076.95, 3095.5199999999504, 0.20533046923653167, 0.28152732305477585, 0.4285070437094416], "isController": false}, {"data": ["Create Agreement Intercab PA-PO Proceed", 26, 0, 0.0, 1415.8076923076924, 1021, 2032, 1241.0, 1950.9, 2011.6999999999998, 2032.0, 0.0298402285302425, 0.023050410905685367, 0.06405158428659473], "isController": false}, {"data": ["Create Aggrement Freight Calculation_PA-PO", 26, 0, 0.0, 1428.6153846153848, 1012, 1871, 1298.0, 1848.7, 1865.4, 1871.0, 0.02984125599551004, 0.022380941996632528, 0.06309210862331956], "isController": false}, {"data": ["Costing Get Exception", 183, 0, 0.0, 1403.7923497267766, 1026, 2634, 1183.0, 1902.6, 1955.3999999999999, 2542.4399999999996, 0.20536553943803906, 0.24146495066738188, 0.4271763662138899], "isController": false}, {"data": ["Create Product Single Instance", 180, 0, 0.0, 3768.688888888889, 2327, 9176, 3770.5, 4335.0, 5943.849999999998, 8915.179999999998, 0.2059230328344276, 211.62125563285295, 0.7675861487587988], "isController": false}, {"data": ["Create Agreement Intercab PO-PA Closed Won", 25, 0, 0.0, 1507.0800000000002, 1073, 1949, 1699.0, 1900.4, 1947.2, 1949.0, 0.029973359677918268, 0.023153249516829445, 0.06471786938269267], "isController": false}, {"data": ["Create Aggrement Characteristics_PO-PO", 26, 0, 0.0, 1986.5, 1217, 6902, 1993.5, 2309.3, 5304.599999999993, 6902.0, 0.02992023954604092, 0.06758350983397719, 0.06995024753244332], "isController": false}, {"data": ["Create Costing", 185, 0, 0.0, 1544.254054054054, 1051, 14060, 1232.0, 1980.4000000000003, 2251.9999999999986, 4586.23999999985, 0.20544324658075808, 0.2915127317205483, 0.5388872659335119], "isController": false}, {"data": ["Costing Create Exception", 183, 0, 0.0, 1411.245901639345, 1041, 2382, 1200.0, 1876.3999999999999, 1972.9999999999995, 2360.16, 0.20549098871483915, 0.1645533308068048, 0.5677089912834765], "isController": false}, {"data": ["Create Aggrement Freight Calculation_PA-PA", 26, 0, 0.0, 1429.3846153846155, 1041, 2144, 1231.0, 1946.7, 2077.1499999999996, 2144.0, 0.029896947521658036, 0.02242271064124353, 0.06320985486756803], "isController": false}, {"data": ["Costing Edit Group Copy", 183, 0, 0.0, 1548.398907103825, 1033, 13427, 1265.0, 1954.6, 2113.2, 7755.319999999977, 0.2054789906153366, 0.16354040756982355, 0.44868263966395766], "isController": false}, {"data": ["Create Agreement Characteristics Intercab PO-PA", 26, 0, 0.0, 1703.9615384615383, 1211, 2453, 1918.0, 2177.4, 2380.5499999999997, 2453.0, 0.02994467146088535, 0.06743399647343908, 0.06924705275329737], "isController": false}, {"data": ["Create Agreement Characteristics Intercab PA-PA", 26, 0, 0.0, 1664.1538461538462, 1206, 2436, 1756.0, 2148.7000000000003, 2406.25, 2436.0, 0.029858082238345587, 0.04878180818823454, 0.0688135489086871], "isController": false}, {"data": ["Create Product", 182, 0, 0.0, 1441.6648351648353, 978, 2262, 1337.0, 1834.7, 1941.05, 2242.08, 0.2053205086984823, 0.7302512623826881, 1.0063512042555496], "isController": false}, {"data": ["Create Aggrement Freight Calculation_PO-PA", 25, 0, 0.0, 1450.96, 1053, 1929, 1280.0, 1907.6, 1924.2, 1929.0, 0.02998195086557892, 0.02248646314918419, 0.06338957385154137], "isController": false}, {"data": ["Create Agreement Intercab PA-PO Closed Won", 26, 0, 0.0, 1558.076923076923, 1085, 2164, 1752.5, 1929.7, 2111.1499999999996, 2164.0, 0.029839577838834144, 0.023049908271990046, 0.06445815056591907], "isController": false}, {"data": ["Create Agreement Intercab PO-PO", 26, 0, 0.0, 2238.1153846153843, 1605, 2746, 2399.0, 2691.2, 2727.7999999999997, 2746.0, 0.02990922550060566, 0.12877907737516636, 0.16052842124153194], "isController": false}, {"data": ["Create Pricing", 180, 3, 1.6666666666666667, 1772.5777777777769, 1029, 3116, 1862.5, 2029.6, 2115.95, 2643.7699999999986, 0.206126302746862, 0.47948408984072166, 0.8239013253348694], "isController": false}, {"data": ["Create Agreement Intercab PA-PA", 26, 0, 0.0, 2293.8461538461534, 1735, 2654, 2504.5, 2622.6, 2653.3, 2654.0, 0.029852974102544966, 0.18322845921337413, 0.2088542055377267], "isController": false}, {"data": ["Create Agreement Intercab PO-PA Proceed", 25, 0, 0.0, 1607.8799999999999, 1025, 2357, 1795.0, 2155.2000000000007, 2346.5, 2357.0, 0.029961613181192257, 0.02314417580695613, 0.0642536157674787], "isController": false}, {"data": ["Create Costing Instance Group", 184, 0, 0.0, 1390.603260869565, 1019, 2366, 1202.5, 1868.0, 1925.5, 2319.2500000000005, 0.20525863703802863, 0.15193949890119698, 0.4918991164954319], "isController": false}, {"data": ["Create Agreement Characteristics Intercab PA-PO", 26, 0, 0.0, 1582.3461538461538, 1101, 3701, 1430.0, 1951.6, 3094.0999999999976, 3701.0, 0.029755228909264863, 0.0915903139863309, 0.07066866865950404], "isController": false}, {"data": ["Get Product Instance", 180, 0, 0.0, 812.5833333333331, 395, 1519, 1088.0, 1210.8, 1230.0, 1365.9099999999996, 0.20642556924717742, 0.480382940933617, 0.4420813216397071], "isController": false}, {"data": ["Create Aggrement Freight Calculation_PO-PO", 26, 0, 0.0, 1517.5, 1056, 2391, 1668.5, 1895.2, 2247.8499999999995, 2391.0, 0.029954607249014956, 0.022465955436761217, 0.063331762396599], "isController": false}, {"data": ["Agreement Creatiom Corporatesearch", 182, 0, 0.0, 1573.203296703297, 1039, 2685, 1762.0, 1930.6000000000001, 2050.55, 2684.17, 0.20530591709701945, 0.17703625468424627, 0.43547309759250613], "isController": false}, {"data": ["Create Agreement Intercab PO-PA", 26, 0, 0.0, 2244.961538461539, 1741, 2638, 2431.5, 2593.8, 2633.8, 2638.0, 0.029951605118038124, 0.13940366210211885, 0.16991100989324556], "isController": false}, {"data": ["Create Agreement Intercab PA-PA Proceed", 26, 0, 0.0, 1645.9615384615383, 1047, 2194, 1788.5, 1934.0, 2112.7999999999997, 2194.0, 0.029891654250133366, 0.023090135265483876, 0.06410358665360631], "isController": false}, {"data": ["Delete Pricing", 180, 3, 1.6666666666666667, 1781.2500000000007, 1009, 18559, 1820.5, 1972.1000000000001, 2075.5499999999997, 5598.189999999964, 0.20620446318104754, 0.47968380371339875, 0.43032092538548783], "isController": false}, {"data": ["Create Agreement Intercab PA-PO", 26, 0, 0.0, 2271.730769230769, 1796, 2902, 2443.0, 2798.2000000000003, 2896.05, 2902.0, 0.029795431443577193, 0.16559160189980254, 0.19305926526185027], "isController": false}, {"data": ["Create Agreement Intercab PO-PO Closed Won", 26, 0, 0.0, 1563.1923076923076, 1013, 1972, 1759.0, 1954.2, 1971.65, 1972.0, 0.029957230292751272, 0.023140790196842047, 0.06471229824957599], "isController": false}, {"data": ["Create Agreement Intercab PA-PA Closed Won", 26, 0, 0.0, 1570.7307692307688, 1019, 2101, 1746.0, 1965.1, 2055.1499999999996, 2101.0, 0.029903824699179026, 0.023099536461963485, 0.06459693382283595], "isController": false}, {"data": [" Delete Product", 180, 0, 0.0, 1419.4055555555556, 945, 2208, 1630.5, 1821.1000000000001, 1908.4499999999998, 2196.66, 0.20630632592502599, 0.1658106506213832, 0.43054357275564503], "isController": false}, {"data": ["Create Agreement Intercab PO-PO Proceed", 26, 0, 0.0, 1655.5769230769233, 1082, 2293, 1794.0, 2073.7000000000003, 2274.7999999999997, 2293.0, 0.029978196626991676, 0.023156985871045328, 0.06428917948522825], "isController": false}, {"data": ["Costing Get List-Group Copy", 184, 0, 0.0, 1568.9782608695652, 1036, 14647, 1465.5, 1928.5, 2101.75, 4271.90000000007, 0.20525726320674315, 0.21147110613585351, 0.4311605206618208], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 6, 100.0, 0.18489984591679506], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3245, 6, "400/Bad Request", 6, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Pricing", 180, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Pricing", 180, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
