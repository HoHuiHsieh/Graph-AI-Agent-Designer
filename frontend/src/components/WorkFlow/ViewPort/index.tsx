/**
 * add ViewPort component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { styled } from "@mui/material";
import FlowChart from "./FlowChart";
import { ToolBox } from "./Nodes";
import { useWorkSpace } from "../provider";


const WorkSpace = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "91vh",
  backgroundColor: theme.palette.background.default,
}))

/**
 * collapsible ViewPort component
 * @returns 
 */
export default function ViewPort(): React.ReactNode {
  const { dialogWidth, setDialogWidth } = useWorkSpace();

  // handle resizeable panel
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  return (
    <WorkSpace>
      <PanelGroup
        direction="horizontal"
        onLayout={onLayout}
      >
        <Panel
          defaultSize={100 - dialogWidth}
          minSize={1}
        >
          <FlowChart />
        </Panel>
        <PanelResizeHandle />
        <Panel
          defaultSize={30}
          minSize={20}
          onResize={setDialogWidth}
          collapsedSize={dialogWidth}
          collapsible={true}
        >
          <ToolBox />
        </Panel>
      </PanelGroup>
    </WorkSpace>
  );
}
