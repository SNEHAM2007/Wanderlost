
   // let mapToken =  process.env.MAP_TOKEN ;
   // console.log(mapToken);
    mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    zoom: 12
});

    
const marker = new mapboxgl.Marker({ color: "red"})
.setLngLat(listing.geometry.coordinates)   //listing.geometry.coordinat
.setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'})
    
    .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`
    )
)
.addTo(map);
//console.log("Map coordinates:", coordinates);