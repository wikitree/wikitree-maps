L.Control.ViewMeta = L.Control.extend({
    options: {
        position: `topright`,
        placeholderHTML: `---`
    },

    onRemove: function () {
        L.DomUtil.remove(this.container);
    },

    onAdd: function (map) {
        this.map = map;

        this.container = L.DomUtil.create(`div`, `leaflet-view-meta`);

        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.on(this.container, `control_container`, function (e) {
            L.DomEvent.stopPropagation(e);
        });
        L.DomEvent.disableScrollPropagation(this.container);

        let table = L.DomUtil.create(
            `table`,
            `leaflet-view-meta-table`,
            this.container
        );

        // map center
        this.addDividerRow(table, `Center`);
        this.lat_e = this.addDataRow(table, `Latitude`);
        this.lng_e = this.addDataRow(table, `Longitude`);
        this.zm_e = this.addDataRow(table, `Zoom`);

        this.map.on(`resize`, () => this.update());
        this.map.on(`zoomend`, () => this.update());
        this.map.on(`dragend`, () => this.update());

        this.urlParams = new URLSearchParams(window.location.search);
        this.parseParams();

        return this.container;
    },

    addDividerRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdDivider = tr.insertCell();
        tdDivider.colSpan = 2;
        tdDivider.innerText = labelString;
    },

    addDataRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdLabel = tr.insertCell();
        tdLabel.innerText = labelString;
        let tdData = tr.insertCell();
        tdData.innerHTML = this.options.placeholderHTML;
        return tdData;
    },

    parseParams: function () {
        let lat, lng, zm;
        try {
            lat = +this.urlParams.get("lat");
            lng = +this.urlParams.get("lng");
            zm = +this.urlParams.get("zm");

            if (lat && lng) {
                this.map.setView([lat, lng], zm);
            }
        } catch (e) {
            console.log(e);
        }
    },

    update: function () {
        let center = this.map.getCenter();

        let latStr = this.formatNumber(center.lat);
        let lngStr = this.formatNumber(center.lng);
        let zStr = this.map.getZoom();

        this.lat_e.innerText = latStr;
        this.lng_e.innerText = lngStr;
        this.zm_e.innerText = zStr;

        this.urlParams.set("lat", latStr);
        this.urlParams.set("lng", lngStr);
        this.urlParams.set("zm",zStr);

        window.history.replaceState(
            {},
            "",
            `?${this.urlParams.toString()}`
        );
    },

    formatNumber: function (num) {
        return num.toLocaleString({
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });
    }
});

L.control.viewMeta = function (options) {
    return new L.Control.ViewMeta(options);
};