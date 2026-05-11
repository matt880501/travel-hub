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
        fill: am5.color("#181818"),
        stroke: am5.color("#ffffff"),
        strokeOpacity: 0.06,
        strokeWidth: 0.3,
        tooltipText: "",
        interactive: true,
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color("#181818"),
      });

      polygonSeries.mapPolygons.template.adapters.add("fill", (fill: any, target: any) => {
        const id = target.dataItem?.get("id") as string;
        if (id === "TW") return am5.color("#826f91");
        if (VISITED.includes(id)) return am5.color("#b89b74");
        return fill;
      });

      polygonSeries.mapPolygons.template.adapters.add("strokeOpacity", (opacity: any, target: any) => {
        const id = target.dataItem?.get("id") as string;
        if (VISITED.includes(id) || id === "TW") return 0.6;
        return opacity;
      });

      polygonSeries.mapPolygons.template.events.on("pointerover", (ev: any) => {
        console.log("hover:", ev.target.dataItem?.get("id"), ev.target.dataItem?.get("name"));
        const id = ev.target.dataItem?.get("id") as string;
        const name = ev.target.dataItem?.get("name") as string;
        if (VISITED.includes(id)) {
          ev.target.set("fill", am5.color("#d8bc92"));
          const e = ev.originalEvent as MouseEvent;
          onHoverRef.current?.(name, e?.clientX, e?.clientY);
        }
      });

      polygonSeries.mapPolygons.template.events.on("pointermove", (ev: any) => {
        const id = ev.target.dataItem?.get("id") as string;
        const name = ev.target.dataItem?.get("name") as string;
        if (VISITED.includes(id)) {
          const e = ev.originalEvent as MouseEvent;
          onHoverRef.current?.(name, e?.clientX, e?.clientY);
        }
      });

      polygonSeries.mapPolygons.template.events.on("pointerout", (ev: any) => {
        const id = ev.target.dataItem?.get("id") as string;
        if (id === "TW") ev.target.set("fill", am5.color("#826f91"));
        else if (VISITED.includes(id)) ev.target.set("fill", am5.color("#b89b74"));
        else ev.target.set("fill", am5.color("#181818"));
        onHoverRef.current?.(null);
      });

      chart.appear(0);
    })();

    return () => root?.dispose();
  }, []);

  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />;
}
