const params = new URLSearchParams(window.location.search);
const rideID = params.get("id");
const ride = getRideRecord(rideID);

document.addEventListener("DOMContentLoaded", async () => {
    const firstPosition = ride.data[0];

    const firstLocationData = await getLocationData(
        firstPosition.latitude,
        firstPosition.longitude
    );

    /* cont-data */
    const dataElement = document.createElement("div");
    dataElement.className = "flex-fill d-flex flex-column";

    /* loc-end */
    const cityDiv = document.createElement("div");
    cityDiv.innerText = `${firstLocationData.locality} - ${firstLocationData.city} - ${firstLocationData.countryCode}`;
    cityDiv.className = "text-primary mb-2";

    /* velocidade max */
    const maxSpeedDiv = document.createElement("div");
    maxSpeedDiv.innerText = `Max Speed: ${getMaxSpeed(ride.data)} Km/h`;
    maxSpeedDiv.className = "h5 text-warning";
    /* distancia */
    const distanceDiv = document.createElement("div");
    distanceDiv.innerText = `Distance: ${getDistance(ride.data)} Km`;
    distanceDiv.className = "text-success";

    /* duraçao */
    const durationDiv = document.createElement("div");
    durationDiv.innerText = `Duration: ${getDuration(ride)}`;
    durationDiv.className = "text-danger";

    /* data */

    const dateDiv = document.createElement("div");
    dateDiv.innerText = getStartDate(ride);
    dateDiv.className = "text-secondary mt-2";
    /* appends*/

    dataElement.appendChild(cityDiv);
    dataElement.appendChild(maxSpeedDiv);
    dataElement.appendChild(distanceDiv);
    dataElement.appendChild(durationDiv);
    dataElement.appendChild(dateDiv);

    document.querySelector("#data").appendChild(dataElement);

    const deleteButton = document.querySelector("#deleteBtn");
    deleteButton.addEventListener("click", () => {
        deleteRide(rideID);
        window.location.href = "./";
    });

    const map = L.map("mapDetail", {
        attributionControl: false,
    });
    map.setView([firstPosition.latitude, firstPosition.longitude], 12);
    L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
        {
            minZoom: 5,
            maxZoom: 18,
            ext: "png",
        }
    ).addTo(map);

    const positionsArray = ride.data.map((position) => {
        return [position.latitude, position.longitude];
    });
    const polyLine = L.polyline(positionsArray, { color: "#FDD708" });
    polyLine.addTo(map);
    map.fitBounds(polyLine.getBounds());
});
