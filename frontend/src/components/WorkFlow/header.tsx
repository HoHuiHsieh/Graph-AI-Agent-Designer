/**
 * header component with logo, name input, and upload/download buttons.
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { AppBar, Box, IconButton, styled, TextField, Toolbar, Typography } from "@mui/material";
import { AccountTreeOutlined, UploadFile, Download } from "@mui/icons-material";
import { Edge, Node, useReactFlow } from "reactflow";
import { useWorkSpace } from "./provider";


// styled header
const HeaderBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "9vh",
  flexGrow: 1,
}))

// styled header appbar
const HeadeAppBar = styled(AppBar)(({ theme }) => ({
  position: "static",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
}))

// styled logo
const Logo = styled(AccountTreeOutlined)(({ theme }) => ({
  fontSize: 60,
  marginLeft: 0,
  marginRight: 10,
  color: theme.palette.primary.main
}))


/**
 * header component
 * @returns 
 */
export default function Header(): React.ReactNode {
  const { name, setName } = useWorkSpace();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  // handle download workflow file
  const handleDownload = React.useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    let filename = `${name}.json`;
    let contentType = "application/json;charset=utf-8;";
    let a = document.createElement("a");
    a.download = filename;
    a.href = "data:" + contentType + "," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 4));
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [name, getNodes, getEdges])


  // handle upload workflow file
  const inputFile = React.useRef<HTMLInputElement | null>(null);
  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      if (event.target.files == null) {
        return;
      }
      event.preventDefault();
      let reader = new FileReader();
      let file = event.target.files[0];
      if (!file) { return }
      reader.onloadend = async () => {
        try {
          let data: { nodes: Node[], edges: Edge[] } = JSON.parse(await file.text());
          setNodes(data.nodes);
          setEdges(data.edges);
          setName(file.name.replace(/\.[^/.]+$/, ""));
        } catch (error) {
          console.error(error);
          alert(JSON.stringify(error))
        }
      };
      reader.readAsDataURL(file);
    },
    [setNodes, setEdges, setName]
  );

  return (
    <HeaderBox >
      <HeadeAppBar sx={{ height: "100%" }} >
        <Toolbar>
          <Logo />
          <Typography
            variant="h1"
            component="div"
            color="primary"
            sx={{ flexGrow: 1 }}
            noWrap
          >
            Graph AI-Agent Designer
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box display="inline-flex">
            <IconButton
              onClick={() => inputFile.current?.click()}
            >
              <UploadFile fontSize="large" />
              <Typography variant="button">
                Upload
              </Typography>
            </IconButton>
            <IconButton
              onClick={handleDownload}
            >
              <Download fontSize="large" />
              <Typography variant="button">
                Download
              </Typography>
            </IconButton>
            <TextField
              label="Project Name"
              size="small"
              value={name || " "}
              onChange={(e) => setName(e.target.value)}
              error={name === ""}
              helperText={name === "" ? "Empty field!" : " "}
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "#FFF"
                  }
                },
                formHelperText: {
                  style: {
                    position: "absolute",
                  },
                }
              }}
            />
            <input
              id="download_flow"
              hidden
              type="file"
              accept=".json"
              onChange={handleUpload}
              ref={inputFile}
            />
          </Box>
        </Toolbar>

      </HeadeAppBar>
    </HeaderBox>
  );
}
