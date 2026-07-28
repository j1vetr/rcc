---
name: Swiss map rendering
description: How the interactive Switzerland canton map is built and pitfalls with react-simple-maps
---
- The canton map uses react-simple-maps + the `swiss-maps` package TopoJSON (objects: country, cantons, districts, municipalities, lakes). Canton geometries carry numeric BFS ids 1-26, no properties.
- **Pitfall:** react-simple-maps only reads the FIRST object of a TopoJSON topology. Passing the raw file renders `country` only. Convert explicitly with `feature(topo, topo.objects.cantons)` from topojson-client and pass the FeatureCollection.
- **Pitfall:** react-icons Tabler set has no `TbCarSport`; use `IoCarSportSharp` (io5) for sports car.
- YouTube hero embeds show "Sign in to confirm you're not a bot" in headless screenshots; this is bot detection in the screenshot tool, not a site bug.
