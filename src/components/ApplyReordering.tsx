import React from "react";
import { Button } from "@patternfly/react-core";
import { devMode } from "./DomainTable";
import cockpit from 'cockpit';

interface ReorderProps {
  setShowButton: React.Dispatch<React.SetStateAction<boolean>>;
}


export const ApplyReordering: React.FunctionComponent<ReorderProps> = ({ setShowButton }) => {

  function onClick() {
    if (devMode) {
      console.log('sudo systemctl reload haproxy');
    } else {
    cockpit.spawn(['sudo', 'systemctl', 'reload', 'haproxy'], {superuser: 'require'});
    }
    setShowButton(false);
  }

  return (
    <Button onClick={onClick}>Apply Order</Button>
  )
}