/**
 * add workspace store and provider
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { getOptions, OptionsData } from "@/action/getOptions";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ChatDialog } from "./typedef";

// types of store items
type StoreContent = {
  name: string,
  loading: number | boolean,
  locking: boolean,
  options: OptionsData,
  dialogs: ChatDialog[],
  dialogWidth: number,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<number | boolean>>,
  setLocking: React.Dispatch<React.SetStateAction<boolean>>,
  setOptions: React.Dispatch<React.SetStateAction<OptionsData>>,
  setDialogs: React.Dispatch<React.SetStateAction<ChatDialog[]>>,
  setDialogWidth: React.Dispatch<React.SetStateAction<number>>,
};

// default values of store items
const context: StoreContent = {
  name: "Unnamed Project",
  loading: false,
  locking: false,
  options: {
    models: {
      chat: [],
      function_call: [],
      code_completion: [],
      embedding: [],
    }, 
    envs: []
  },
  dialogs: [],
  dialogWidth: 30,
  setName: () => { },
  setLoading: () => { },
  setLocking: () => { },
  setOptions: () => { },
  setDialogs: () => { },
  setDialogWidth: () => { },
};
const WorkSpaceStore = createContext(context);

/**
 * hook to access WorkSpaceStore context
 * @returns
 */
export function useWorkSpace() {
  const context = useContext(WorkSpaceStore);
  if (!context) throw new Error("Must be used within Provider!");
  return context;
}

/**
 * Provider to manage workspace state
 * @param props
 * @returns
 */
export function WorkSpaceProvider(props: object): React.ReactNode {
  const [name, setName] = useState(context.name);
  const [loading, setLoading] = useState<number | boolean>(context.loading);
  const [locking, setLocking] = useState<boolean>(context.locking);

  // initialize options
  const [options, setOptions] = useState<OptionsData>(context.options);
  useEffect(() => {
    getOptions()
      .then((value) => setOptions(value))
      .catch((error) => alert(error))
  }, []) 

  // chat dialogs
  const [dialogs, setDialogs] = useState<ChatDialog[]>(context.dialogs);
  const [dialogWidth, setDialogWidth] = useState<number>(context.dialogWidth);

  return (
    <WorkSpaceStore.Provider
      value={{
        name,
        loading,
        locking,
        options,
        dialogs,
        dialogWidth,
        setName,
        setLoading,
        setLocking,
        setOptions,
        setDialogs,
        setDialogWidth,
      }}
      {...props}
    />
  );
}

