"use client";
import { useEffect, useRef } from "react";
const VISITED = ["JP", "PH", "AU", "NZ", "TH", "EG", "AT", "CZ", "TW"];
export default function AmMap({ onHover }: { onHover?: (name: string | null, x?: number, y?: number) => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  useEffect(() => {
    if (!divRef.current) return;
    let root: any;
    (async () => {
      const am5 = await import("@amcharts/amcharts5");
      const am5map = await import("@amcharts/amcharts5/map");
      const worldLow = await import("@amcharts/amcharts5-geodata/worldLow");
      if (divRef.current!.innerHTML !== "") return;
      root = am5.Root.new(divRef.current!);
      root._logo?.dispose();
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoNaturalEarth1(),
          panX: "none", panY: "none", wheelY: "none",
          paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
        })
      );
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: worldLow.default,
          exclude: ["AQ"],
        })
      );
      polygonSeries.mapPolygons.template.setAll({
        stroke: am5.color("#ffffff"),
        strokeOpacity: 0.06,
        strokeWidth: 0.3,
        interactive: true,
        templateField: "polygonSettings",
      });
      polygonSeries.events.on("datavalidated", () => {
        polygonSeries.mapPolygons.each((polygon: any) => {
          const id = polygon.dataItem?.get("id") as string;
          if (id === "TW") {
            polygon.set("fill", am5.color("#826f91"));
            polygon.set("strokeOpacity", 0.6);
          } else if (VISITED.includes(id)) {
            polygon.set("fill", am5.color("#b89b74"));
            polygon.set("strokeOpacity", 0.6);
          } else {
            polygon.set("fill", am5.color("#181818"));
          }
          polygon.events.on("pointerover", () => {
            if (VISITED.includes(id) || id === "TW") {
              polygon.set("fill", am5.color(id === "TW" ? "#9a85aa" : "#d8bc92"));
            }
          });
          polygon.events.on("pointerout", () => {
            if (id === "TW") polygon.set("fill", am5.color("#826f91"));
            else if (VISITED.includes(id)) polygon.set("fill", am5.color("#b89b74"));
            else polygon.set("fill", am5.color("#181818"));
            onHoverRef.current?.(null);
          });
          polygon.events.on("pointermove", (ev: any) => {
            if (VISITED.includes(id) || id === "TW") {
              const name = polygon.dataItem?.get("name") as string;
              const e = ev.originalEvent as MouseEvent;
              onHoverRef.current?.(name, e?.clientX, e?.clientY);
            }
          });
        });
      });
      chart.appear(0);
    })();
    return () => root?.dispose();
  }, []);
  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />;
}
