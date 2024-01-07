import React from "react";
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import sbomData from "../../../sbom.json";
import { Title } from "../../components/title";
//
import { Stack, List, ListItem, ListItemText } from "@mui/material";
// ----------------------------------------------------------------------

const Credits = () => {
  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <Title value={"Skyway powered by:"} />

        <OutlinePaper>
          <List>
            {sbomData["packages"].map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item.name}
                  secondary={`${
                    item.versionInfo ? item.versionInfo : "Unknown Version"
                  } | ${
                    item.licenseConcluded
                      ? item.licenseConcluded
                      : item.licenseDeclared
                        ? item.licenseDeclared
                        : "Unknown License"
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export { Credits };
