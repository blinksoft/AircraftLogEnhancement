(function () {
        'use strict';

        var sessionKey = "AircraftLogStateData";
        var state = loadState();

        window.addEventListener("load", () => {
            addButton();
            addGetAllAircraftButton();
            addDownloadButton();
            updateFormWithEndSelectors();
            if (state.hasOwnProperty("endMonth")) {
                document.getElementById('endMonth').value = state.endMonth;
            }

            if (state.hasOwnProperty("endYear")) {
                document.getElementById('endYear').value = state.endYear;
            }

            if (hasTailNo(state.lastTailNoSelected) && !isTailNoSelected(state.lastTailNoSelected)) {
                document.getElementById('ddlTailNo').value = state.lastTailNoSelected;
                document.getElementById('ddlTailNo').dispatchEvent(new Event('change'));
                submitForm();
            }
        });


        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.datatables.net/v/dt/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-html5-1.6.1/b-print-1.6.1/cr-1.5.2/fc-3.3.0/fh-3.1.6/rg-1.1.1/sp-1.0.1/datatables.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link);


//<script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-html5-1.6.1/b-print-1.6.1/cr-1.5.2/fc-3.3.0/fh-3.1.6/rg-1.1.1/sp-1.0.1/datatables.min.js"></script>


        console.log(state);
        console.log(JSON.stringify(state));
        checkLogForErrors();

        document.getElementById('ddlMonth').addEventListener("change", (event) => {
            state.lastTailNoSelected = document.getElementById('ddlTailNo').value;
            saveState()
        });
        document.getElementById('ddlYear').addEventListener("change", (event) => {
            state.lastTailNoSelected = document.getElementById('ddlTailNo').value;
            saveState()
        });
        document.getElementById('ddlTailNo').addEventListener("change", (event) => {
            state.lastTailNoSelected = document.getElementById('ddlTailNo').value;
            saveState()
        });





        if (state.getDataLoop == true) {
            console.log("In getDataLoop");
            getNextTailNoData();
        }

        let newDiv = document.createElement("div");
        newDiv.setAttribute("id", "newTableDiv");
        document.getElementById("content").appendChild(newDiv);

        let table = makeTable("newTable", state.aircraftLogData.slice(0, 2))
        table.classList.add("display");
        table.classList.add("cell-border");

        document.getElementById("newTableDiv").appendChild(table);

        function makeTable(id, data) {
            console.log(data);
            var table = document.createElement('table');
            let thead =  document.createElement('thead');
            let theadtr = document.createElement('tr');
            for (let j = 0; j < data[0].length; j++) {
                let cell = document.createElement('th');
                cell.textContent = data[0][j];
                theadtr.appendChild(cell);
            }
            thead.appendChild(theadtr);
            table.appendChild(thead);

            // for (var i = 1; i < data.length; i++) {
            //     let row = null;
            //     let thead = null;
            //         row = document.createElement('tr');
            //     for (var j = 0; j < data[i].length; j++) {
            //         let cell = document.createElement('td');
            //         cell.textContent = data[i][j];
            //         row.appendChild(cell);
            //     }
            //         table.appendChild(row);
            // }
            table.setAttribute("id", id);
            return table;
        }

        $('#newTable').DataTable( {
            data: state.aircraftLogData.slice(1),
            paging: false,
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ]
        } );

        function collectData() {
            let table = document.getElementById("gvLog");
            if (!state.hasOwnProperty("aircraftLogData")) {
                state.aircraftLogData = [["Date", "Time", "Wing", "Tail", "Mission", "Sortie", "Mission Symbol", "Hobbs End", "Hobbs Start", "Hobbs Total", "Tach End", "Tach Start", "Tach Total", "Pilot", "CapId", "TrackingNo", "Cost", "Gallons"]];
            }

            if (table !== null) {
                for (let i = 1; i < table.rows.length - 2; i++) {
                    // console.log("in loop " + i);
                    let row = table.rows[i];
                    //iterate through rows
                    //rows would be accessed using the "row" variable assigned in the for loop
                    // console.log(row.cells[1].innerText);
                    // console.log(row.cells[3].innerText);
                    // console.log(row.cells[4].innerText);
                    // console.log(row.cells[5].getElementsByTagName("table")[0].rows[2].cells[0].innerText);
                    // console.log(row.cells[6].getElementsByTagName("table")[0].rows[2].cells[0].innerText);
                    // console.log(row.cells[8].innerText);
                    // console.log(row.cells[9].innerText);
                    // console.log("all cells");
                    let matcher = row.cells[7].innerText.match(/(.*) \((\d+)\)/);
                    let capId = "";
                    let pilotName = "";
                    if (matcher != null) {
                        capId = matcher[2];
                        pilotName = matcher[1];
                    } else {
                        capId = "";
                        pilotName = row.cells[7].innerText.replace(String.fromCharCode(160), "");
                    }
                    let sortieMatcher = row.cells[3].innerText.match(/(.*)\/(.*)/);
                    let sortieNumber = "";
                    let missionNumber = "";
                    if (sortieMatcher != null) {
                        missionNumber = sortieMatcher[1];
                        sortieNumber = sortieMatcher[2];
                    } else {
                        missionNumber = row.cells[3].innerText.replace(String.fromCharCode(160), "");
                    }

                    let vals = [row.cells[1].innerText,
                        row.cells[2].innerText,
                        document.getElementById('ddlWings').value,
                        document.getElementById('ddlTailNo').value,
                        missionNumber,
                        sortieNumber,
                        row.cells[4].innerText,
                        row.cells[5].getElementsByTagName("table")[0].rows[0].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        row.cells[5].getElementsByTagName("table")[0].rows[1].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        row.cells[5].getElementsByTagName("table")[0].rows[2].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        row.cells[6].getElementsByTagName("table")[0].rows[0].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        row.cells[6].getElementsByTagName("table")[0].rows[1].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        row.cells[6].getElementsByTagName("table")[0].rows[2].cells[0].innerText.replace(String.fromCharCode(160), ""),
                        pilotName,
                        capId,
                        row.cells[8].innerText,
                        row.cells[9].innerText,
                        row.cells[10].innerText.replace(String.fromCharCode(160), "")];

                    state.aircraftLogData.push(vals);
                }
            }
            saveState();
        }

        function loadState() {
            var data = {};
            let dataJson = sessionStorage.getItem(sessionKey);
            if (dataJson != null) {
                data = JSON.parse(dataJson);
            }
            return data;
        }

        function saveState() {
            sessionStorage.setItem(sessionKey, JSON.stringify(state));
        }


        function getNextTailNoData() {
            console.log("In getNext");
            var options = document.getElementById("ddlTailNo").options;
            // var options = Array.from(document.getElementById("ddlTailNo").options);
            if (state.hasOwnProperty("lastTailNoProcessed")) {
                console.log("has lastTailNoProcessed " + JSON.stringify(state));
                for (var i = 0; i < options.length; i++) {
                    console.log("i: " + i);
                    if (i + 1 < options.length) {  // check to make sure there is anext plane
                        if (options[i].value == state.lastTailNoProcessed) {
                            if (!state.initialRun) {
                                collectData();
                            } else {
                                delete state.initialRun
                            }
                            console.log("setting next value to : " + options[i + 1].value);
                            document.getElementById('ddlTailNo').value = options[i + 1].value;
                            document.getElementById('ddlTailNo').dispatchEvent(new Event('change'));
                            state.lastTailNoProcessed = options[i + 1].value;
                            submitForm();
                            break;
                        }
                    } else {
                        state.getDataLoop = false;  // We have got all of the aircraft
                        saveState();

                        //display data.
                    }
                }
            }
        }


        function hasTailNo(tailNo) {
            console.log("has tail: " + tailNo);
            console.log(document.getElementById("ddlTailNo"));
            var options = document.getElementById("ddlTailNo").options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value == tailNo) {
                    return true;
                }
            }
            return false;
        }

        function isTailNoSelected(tailNo) {
            if (tailNo == document.getElementById("ddlTailNo").value) {
                return true;
            }
            return false;
        }

        function addAircraftSelect() {
            var select = document.getElementById('ddlTailNo').cloneNode(true);
            select.id = "capplugin_ddlTailNo";
            select.name = "capplugin_ddlTailNo";
            document.body.appendChild(select);
        }

        function addButton(text, onclick, cssObj) {
            cssObj = cssObj || {
                position: "fixed",
                top: "60px",
                right: "4%",
                "z-index": 3,
                fontWeight: "600",
                fontSize: "14px",
                backgroundColor: "#00cccc",
                color: "white",
                border: "none",
                padding: "10px 20px"
            };
            let button = document.createElement("input"),
                btnStyle = button.style;
            button.setAttribute("type", "submit");
            button.setAttribute("name", "ctl00$BodyContent$btnReport")
            button.setAttribute("value", "Get Log")
            document.getElementById('Form1').appendChild(button);
            button.onclick = selectReadFn;
            Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
            return button;
        }

        function submitForm() {
            let f = document.createElement("input")
            f.setAttribute("type", "hidden");
            f.setAttribute("name", "ctl00$BodyContent$btnReport")
            f.setAttribute("value", "Get Log");
            document.getElementById('Form1').appendChild(f);
            saveState();
            document.getElementById('Form1').submit()
        }

        function updateFormWithEndSelectors() {
            let clearDiv = document.querySelector('#pnlAircraft > div:nth-child(6)').cloneNode(true);
            document.querySelector('#pnlAircraft').insertBefore(clearDiv, document.querySelector('#pnlAircraft > div:nth-child(6)'));

            let year = document.querySelector("#pnlAircraft > div:nth-child(4)").cloneNode(true);
            document.querySelector("#pnlAircraft > div:nth-child(4) > span").innerHTML = "Start Year";
            year.querySelector("span").innerHTML = "End Year";
            year.querySelector("#ddlYear").name = "endYear"
            year.querySelector("#ddlYear").removeAttribute("onchange");
            year.querySelector("#ddlYear").addEventListener("change", (event) => {
                state.endYear = document.getElementById('endYear').value;
                state.endMonth = document.getElementById('endMonth').value;
                saveState()
            });
            year.querySelector("#ddlYear").id = "endYear";
            document.querySelector('#pnlAircraft').insertBefore(year, document.querySelector('#pnlAircraft > div:nth-child(7)'));

            let month = document.querySelector("#pnlAircraft > div:nth-child(3)").cloneNode(true);
            document.querySelector("#pnlAircraft > div:nth-child(3) > span").innerHTML = "Start Month";
            month.querySelector("span").innerHTML = "End Month";
            month.querySelector("#ddlMonth").name = "endMonth"
            month.querySelector("#ddlMonth").removeAttribute("onchange");
            month.querySelector("#ddlMonth").addEventListener("change", (event) => {
                state.endYear = document.getElementById('endYear').value;
                state.endMonth = document.getElementById('endMonth').value;
                saveState()
            });
            month.querySelector("#ddlMonth").id = "endMonth";

            document.querySelector('#pnlAircraft').insertBefore(month, document.querySelector('#pnlAircraft > div:nth-child(7)'));
        }


        function addGetAllAircraftButton(text, onclick, cssObj) {
            cssObj = cssObj || {
                position: "fixed",
                top: "100px",
                right: "4%",
                "z-index": 3,
                fontWeight: "600",
                fontSize: "14px",
                backgroundColor: "#00cccc",
                color: "white",
                border: "none",
                padding: "10px 20px"
            };
            let button = document.createElement("button"),
                btnStyle = button.style;
            button.innerHTML = "Get All Aircraft";
            document.body.appendChild(button);
            button.onclick = function () {
                document.getElementById('ddlTailNo').value = "0";
                state.lastTailNoProcessed = "0";
                state.getDataLoop = true;
                delete state.aircraftLogData
                state.initialRun = true;
                getNextTailNoData()
            };
            Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
            return button;
        }

        function getAircraftLogCsv() {
            return state.aircraftLogData.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"` : String(item)).join(',')).join('\n');
        }

        function addDownloadButton(text, onclick, cssObj) {
            cssObj = cssObj || {
                position: "fixed",
                top: "140px",
                right: "4%",
                "z-index": 3,
                fontWeight: "600",
                fontSize: "14px",
                backgroundColor: "#00cccc",
                color: "white",
                border: "none",
                padding: "10px 20px"
            };
            let button = document.createElement("button"),
                btnStyle = button.style;
            button.innerHTML = "Download CSV";
            document.body.appendChild(button);
            button.onclick = function () {
                download(new Blob([getAircraftLogCsv()]), "AirCraftLog.csv", "application/csv; charset=UTF-8");
                getNextTailNoData()
            };
            Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
            return button;
        }

        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        function selectReadFn() {
            document.getElementById('Form1').submit();
        }


        function checkLogForErrors() {
            if ($('#gvLog > tbody > tr:nth-last-child(1) > td:nth-child(5)').html() != "Start/Finish Subtraction Total") {
                $('#gvLog').append('<tr><td></td><td></td><td></td><td></td><td>Start/Finish Subtraction Total</td><td class="total">hobbs</td><td class="total">tach</td><td></td><td></td><td></td><td></td><td></td></tr>');
            }
            var startHobbs = parseFloat($('#gvLog > tbody > tr:nth-child(2) > td:nth-child(6) > table > tbody > tr:nth-child(2) > td.hobbs').html());
            var endHobbs = parseFloat($('#gvLog > tbody > tr:nth-last-child(3) > td:nth-child(6) > table > tbody > tr:nth-child(1) > td.hobbs').html());
            var startTach = parseFloat($('#gvLog > tbody > tr:nth-child(2) > td:nth-child(7) > table > tbody > tr:nth-child(2) > td.hobbs').html());
            var endTach = parseFloat($('#gvLog > tbody > tr:nth-last-child(3) > td:nth-child(7) > table > tbody > tr:nth-child(1) > td.hobbs').html());
            console.log("START: " + startHobbs.toString());
            console.log("END: " + endHobbs.toString());
            var totalHobbs = (endHobbs - startHobbs).toFixed(2);
            var totalTach = (endTach - startTach).toFixed(2);

            $('#gvLog > tbody > tr:nth-last-child(1) > td:nth-child(6)').html(totalHobbs);
            $('#gvLog > tbody > tr:nth-last-child(1) > td:nth-child(7)').html(totalTach);

            var hobbs = $('#gvLog > tbody > tr:nth-last-child(2) > td:nth-child(6)').html();
            var tach = $('#gvLog > tbody > tr:nth-last-child(2) > td:nth-child(7)').html();

            if (hobbs != totalHobbs) {
                $('#gvLog > tbody > tr:nth-last-child(1) > td:nth-child(6)').css('background-color', 'red');
            }

            if (tach != totalTach) {
                $('#gvLog > tbody > tr:nth-last-child(1) > td:nth-child(7)').css('background-color', 'red');
            }


            var tableLen = $('#gvLog > tbody > tr').length;
            for (var x = 2; x < tableLen - 2; x++) {
                console.log("in loop " + x);
                var eHobbs = $('#gvLog > tbody > tr:nth-child(' + x.toString() + ') > td:nth-child(6) > table > tbody > tr:nth-child(1) > td.hobbs').html();
                var sHobbs = $('#gvLog > tbody > tr:nth-child(' + (x + 1).toString() + ') > td:nth-child(6) > table > tbody > tr:nth-child(2) > td.hobbs').html();
                var eTach = $('#gvLog > tbody > tr:nth-child(' + x.toString() + ') > td:nth-child(7) > table > tbody > tr:nth-child(1) > td.hobbs').html();
                var sTach = $('#gvLog > tbody > tr:nth-child(' + (x + 1).toString() + ') > td:nth-child(7) > table > tbody > tr:nth-child(2) > td.hobbs').html();
                if (eHobbs != sHobbs) {
                    $('#gvLog > tbody > tr:nth-child(' + x.toString() + ') > td:nth-child(6) > table > tbody > tr:nth-child(1) > td.hobbs').css('background-color', 'red');
                    $('#gvLog > tbody > tr:nth-child(' + (x + 1).toString() + ') > td:nth-child(6) > table > tbody > tr:nth-child(2) > td.hobbs').css('background-color', 'red');
                }
                if (eTach != sTach) {
                    $('#gvLog > tbody > tr:nth-child(' + x.toString() + ') > td:nth-child(7) > table > tbody > tr:nth-child(1) > td.hobbs').css('background-color', 'red');
                    $('#gvLog > tbody > tr:nth-child(' + (x + 1).toString() + ') > td:nth-child(7) > table > tbody > tr:nth-child(2) > td.hobbs').css('background-color', 'red');
                }
            }
        }


        function download(data, strFileName, strMimeType) {

            var self = window, // this script is only for browsers anyway...
                defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
                mimeType = strMimeType || defaultMime,
                payload = data,
                url = !strFileName && !strMimeType && payload,
                anchor = document.createElement("a"),
                toString = function (a) {
                    return String(a);
                },
                myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
                fileName = strFileName || "download",
                blob,
                reader;
            myBlob = myBlob.call ? myBlob.bind(self) : Blob;

            if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
                payload = [payload, mimeType];
                mimeType = payload[0];
                payload = payload[1];
            }


            if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
                fileName = url.split("/").pop().split("?")[0];
                anchor.href = url; // assign href prop to temp anchor
                if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
                    var ajax = new XMLHttpRequest();
                    ajax.open("GET", url, true);
                    ajax.responseType = 'blob';
                    ajax.onload = function (e) {
                        download(e.target.response, fileName, defaultMime);
                    };
                    setTimeout(function () {
                        ajax.send();
                    }, 0); // allows setting custom ajax headers using the return:
                    return ajax;
                } // end if valid url?
            } // end if url?


            //go ahead and download dataURLs right away
            if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {

                if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
                    payload = dataUrlToBlob(payload);
                    mimeType = payload.type || defaultMime;
                } else {
                    return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
                        navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
                        saver(payload); // everyone else can save dataURLs un-processed
                }

            }//end if dataURL passed?

            blob = payload instanceof myBlob ?
                payload :
                new myBlob([payload], {type: mimeType});


            function dataUrlToBlob(strUrl) {
                var parts = strUrl.split(/[:;,]/),
                    type = parts[1],
                    decoder = parts[2] == "base64" ? atob : decodeURIComponent,
                    binData = decoder(parts.pop()),
                    mx = binData.length,
                    i = 0,
                    uiArr = new Uint8Array(mx);

                for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

                return new myBlob([uiArr], {type: type});
            }

            function saver(url, winMode) {

                if ('download' in anchor) { //html5 A[download]
                    anchor.href = url;
                    anchor.setAttribute("download", fileName);
                    anchor.className = "download-js-link";
                    anchor.innerHTML = "downloading...";
                    anchor.style.display = "none";
                    document.body.appendChild(anchor);
                    setTimeout(function () {
                        anchor.click();
                        document.body.removeChild(anchor);
                        if (winMode === true) {
                            setTimeout(function () {
                                self.URL.revokeObjectURL(anchor.href);
                            }, 250);
                        }
                    }, 66);
                    return true;
                }

                // handle non-a[download] safari as best we can:
                if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
                    url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
                    if (!window.open(url)) { // popup blocked, offer direct download:
                        if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) {
                            location.href = url;
                        }
                    }
                    return true;
                }

                //do iframe dataURL download (old ch+FF):
                var f = document.createElement("iframe");
                document.body.appendChild(f);

                if (!winMode) { // force a mime that will download:
                    url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
                }
                f.src = url;
                setTimeout(function () {
                    document.body.removeChild(f);
                }, 333);

            }//end saver


            if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
                return navigator.msSaveBlob(blob, fileName);
            }

            if (self.URL) { // simple fast and modern way using Blob and URL:
                saver(self.URL.createObjectURL(blob), true);
            } else {
                // handle non-Blob()+non-URL browsers:
                if (typeof blob === "string" || blob.constructor === toString) {
                    try {
                        return saver("data:" + mimeType + ";base64," + self.btoa(blob));
                    } catch (y) {
                        return saver("data:" + mimeType + "," + encodeURIComponent(blob));
                    }
                }

                // Blob but not URL support:
                reader = new FileReader();
                reader.onload = function (e) {
                    saver(this.result);
                };
                reader.readAsDataURL(blob);
            }
            return true;
        }; /* end download() */

    }

)();