//const { CONNREFUSED } = require("dns");

let BASE_URL = {
    dev: "http://localhost:10000",
    prod: "",

}

let isDev = true;
let App = {
    buildRequest: async (url, post) => {
        let opt = {
            method: post ? "POST" : "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors"
        }
        try {
           
            let _url = isDev ? BASE_URL.dev + await url : BASE_URL.prod + await url;
            let _req = await fetch(_url, opt);
            //console.log("URL_afta : ", await _req.text());
            //console.log(_req.body)
            _req = await _req.json();
            return _req;
        }
        catch (e) {
            console.log("Error:: ", e);
            return {
                status: "error",
                success: false
            }
        }
    },
    searchJobs: async () => {
        let _query = "?";
        let lat = document.getElementById("latitude").value;
        let lng = document.getElementById("longitude").value;
        let radius = document.getElementById("radius").value;
        let title = document.getElementById("title").value;
        lat != "" ? _query += `lat=${lat}&` : "";
        lng != "" ? _query += `lng=${lng}&` : "";
        radius != "" ? _query += `radius=${radius}&` : "";
        title != "" ? _query += `title=${title}&` : "";
        App.preload.load()
        let jC = document.getElementById("jobsContainer");
        let _req = await App.buildRequest(`/near_by${_query}`, false);
        if (_req.success) {
            console.log(_req);
            
            let _loadHtml = ""
            let { data, dataLength } = _req;
            setTimeout(() => {
                if (dataLength > 0) {
                    data.forEach(element => {
                        _loadHtml += `<div class="dataContainer">
                                        <p class="default-pink-text font-manrope-bold">${element.title}</p>    
                                    </div>
                    `
                    });
                }
                else {
                    _loadHtml += `<div class="dataContainer">
                                        <p class="default-pink-text font-manrope-bold">${title} jobs not available in this region</p>    
                                    </div>
                    `
                }
                App.preload.unload();
                //console.log(_loadHtml)
                jC.innerHTML = _loadHtml;
            }, App.preload.time)
           
            
        }
        else {
            jC.innerHTML = `<div class="dataContainer">
                                <p class="default-pink-text font-manrope-bold">${_req.message} jobs not available in this region</p>    
                            </div>
                    `
            console.log(_req);
        }
    },
    preload: {
        time : 3000,
        skeleton: `<div id="preLoader" class="preloadContainer">
                        <div class="div preloadOne">

                        </div>
                        <div class="div preloadTwo">

                        </div>
                    </div>`,
        load: async () => {
            let _jobsContainer = document.getElementById("jobsContainer");
            //_jobsContainer.innerHTML = "";
            _jobsContainer.innerHTML = App.preload.skeleton;
        },
        unload: async () => {
            let _jobsContainer = document.getElementById("jobsContainer");
            _jobsContainer.innerHTML = "";
        }
    }
}