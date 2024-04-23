import { FC, useEffect, useState } from "react";
import { getDoc } from "../api/ServerData";

const UserDoc: FC = () => {
    const [doc, setDoc] = useState<String>();

    useEffect(()=> {
      getDoc().then((response: any)=>{
        setDoc(response.data)
      }).catch(error => {
        console.error(error)
      })
    }, [])

    return <> </>
}

export default UserDoc