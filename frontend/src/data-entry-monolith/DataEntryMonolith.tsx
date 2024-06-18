
  // *********************************************************************
  // * IMPORANT: This file was generated, do not try to modify directly! *
  // *********************************************************************
  import { FC, useState, useEffect } from "react";
  import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
  
  const SUM = (...values: any[]) => {
    return values.reduce((total, current) => total + +current, 0);
  };
  
  const NOT = (expression: any) => {
    return !expression;
  };

  const IF = (expression: any, ifTrue: any, ifFalse: any) => {
    return expression ? ifTrue : ifFalse;
  };

  type DataEntryMonolithProps = {
  p?: any;
  };

  const DataEntryMonolith: FC<DataEntryMonolithProps> = ({
  p,
  }: DataEntryMonolithProps) => {const get_U2hlZXQx_A2:string = "iopl";
const get_U2hlZXQx_B2:string = "Hello";
const get_U2hlZXQx_C2:string = "";
const get_U2hlZXQx_A3:string = "";
const get_U2hlZXQx_B3:string = "How";
const get_U2hlZXQx_C3:string = "";
const get_U2hlZXQx_A4:string = "";
const [get_U2hlZXQx_B4, set_U2hlZXQx_B4] = useState<string>();
const get_U2hlZXQx_C4:string = "";
const [get_U2hlZXQx_A5, set_U2hlZXQx_A5] = useState<string>();
const get_U2hlZXQx_B5:string = "gyn";
const [get_U2hlZXQx_C5, set_U2hlZXQx_C5] = useState<string>();
const get_U2hlZXQx_A6:string = "";
const [get_U2hlZXQx_B6, set_U2hlZXQx_B6] = useState<string>();
const get_U2hlZXQx_C6:string = "lkj";
const [get_U2hlZXQx_A7, set_U2hlZXQx_A7] = useState<number>(0);
const get_U2hlZXQx_B7:string = "";
const get_U2hlZXQx_C7:string = "";
const get_U2hlZXQy_B2:string = "hjk";
const get_U2hlZXQy_C2:string = "";
const get_U2hlZXQy_D2:string = "";
const get_U2hlZXQy_E2:string = "";
const get_U2hlZXQy_F2:string = "";
const get_U2hlZXQy_G2:string = "";
const get_U2hlZXQy_H2:string = "";
const get_U2hlZXQy_I2:string = "";
const get_U2hlZXQy_J2:string = "";
const get_U2hlZXQy_B3:string = "";
const get_U2hlZXQy_C3:string = "";
const get_U2hlZXQy_D3:string = "";
const get_U2hlZXQy_E3:string = "";
const get_U2hlZXQy_F3:string = "";
const get_U2hlZXQy_G3:string = "";
const get_U2hlZXQy_H3:string = "";
const get_U2hlZXQy_I3:string = "";
const get_U2hlZXQy_J3:string = "";
const get_U2hlZXQy_B4:string = "";
const get_U2hlZXQy_C4:string = "";
const get_U2hlZXQy_D4:string = "";
const get_U2hlZXQy_E4:string = "";
const get_U2hlZXQy_F4:string = "";
const get_U2hlZXQy_G4:string = "";
const get_U2hlZXQy_H4:string = "";
const get_U2hlZXQy_I4:string = "";
const get_U2hlZXQy_J4:string = "";
const get_U2hlZXQy_B5:string = "";
const get_U2hlZXQy_C5:string = "";
const get_U2hlZXQy_D5:string = "";
const get_U2hlZXQy_E5:string = "";
const get_U2hlZXQy_F5:string = "";
const get_U2hlZXQy_G5:string = "";
const get_U2hlZXQy_H5:string = "";
const get_U2hlZXQy_I5:string = "";
const get_U2hlZXQy_J5:string = "";
const get_U2hlZXQy_B6:string = "";
const get_U2hlZXQy_C6:string = "";
const get_U2hlZXQy_D6:string = "";
const get_U2hlZXQy_E6:string = "";
const get_U2hlZXQy_F6:string = "";
const get_U2hlZXQy_G6:string = "";
const get_U2hlZXQy_H6:string = "";
const get_U2hlZXQy_I6:string = "";
const get_U2hlZXQy_J6:string = "";
const get_U2hlZXQy_B7:string = "";
const get_U2hlZXQy_C7:string = "";
const get_U2hlZXQy_D7:string = "";
const get_U2hlZXQy_E7:string = "";
const get_U2hlZXQy_F7:string = "";
const get_U2hlZXQy_G7:string = "";
const get_U2hlZXQy_H7:string = "";
const get_U2hlZXQy_I7:string = "";
const get_U2hlZXQy_J7:string = "";
const get_U2hlZXQy_B8:string = "";
const get_U2hlZXQy_C8:string = "";
const get_U2hlZXQy_D8:string = "";
const get_U2hlZXQy_E8:string = "";
const get_U2hlZXQy_F8:string = "";
const get_U2hlZXQy_G8:string = "";
const get_U2hlZXQy_H8:string = "";
const get_U2hlZXQy_I8:string = "";
const get_U2hlZXQy_J8:string = "";
const get_U2hlZXQy_B9:string = "";
const get_U2hlZXQy_C9:string = "";
const get_U2hlZXQy_D9:string = "";
const get_U2hlZXQy_E9:string = "";
const get_U2hlZXQy_F9:string = "";
const get_U2hlZXQy_G9:string = "";
const get_U2hlZXQy_H9:string = "";
const get_U2hlZXQy_I9:string = "";
const get_U2hlZXQy_J9:string = "";
const get_U2hlZXQy_B10:string = "";
const get_U2hlZXQy_C10:string = "";
const get_U2hlZXQy_D10:string = "";
const get_U2hlZXQy_E10:string = "";
const get_U2hlZXQy_F10:string = "";
const get_U2hlZXQy_G10:string = "";
const get_U2hlZXQy_H10:string = "";
const get_U2hlZXQy_I10:string = "";
const get_U2hlZXQy_J10:string = "";
const get_U2hlZXQy_B11:string = "";
const get_U2hlZXQy_C11:string = "";
const get_U2hlZXQy_D11:string = "";
const get_U2hlZXQy_E11:string = "";
const get_U2hlZXQy_F11:string = "";
const get_U2hlZXQy_G11:string = "";
const get_U2hlZXQy_H11:string = "";
const get_U2hlZXQy_I11:string = "";
const get_U2hlZXQy_J11:string = "";
const get_U2hlZXQy_B12:string = "";
const get_U2hlZXQy_C12:string = "";
const get_U2hlZXQy_D12:string = "";
const get_U2hlZXQy_E12:string = "";
const get_U2hlZXQy_F12:string = "";
const get_U2hlZXQy_G12:string = "";
const get_U2hlZXQy_H12:string = "";
const get_U2hlZXQy_I12:string = "";
const get_U2hlZXQy_J12:string = "";
const get_U2hlZXQy_B13:string = "";
const get_U2hlZXQy_C13:string = "";
const get_U2hlZXQy_D13:string = "";
const get_U2hlZXQy_E13:string = "";
const get_U2hlZXQy_F13:string = "";
const get_U2hlZXQy_G13:string = "";
const get_U2hlZXQy_H13:string = "";
const get_U2hlZXQy_I13:string = "";
const get_U2hlZXQy_J13:string = "";
const get_U2hlZXQy_B14:string = "";
const get_U2hlZXQy_C14:string = "";
const get_U2hlZXQy_D14:string = "";
const get_U2hlZXQy_E14:string = "";
const get_U2hlZXQy_F14:string = "";
const get_U2hlZXQy_G14:string = "";
const get_U2hlZXQy_H14:string = "";
const get_U2hlZXQy_I14:string = "";
const get_U2hlZXQy_J14:string = "";
const get_U2hlZXQy_B15:string = "";
const get_U2hlZXQy_C15:string = "";
const get_U2hlZXQy_D15:string = "";
const get_U2hlZXQy_E15:string = "";
const get_U2hlZXQy_F15:string = "";
const get_U2hlZXQy_G15:string = "";
const get_U2hlZXQy_H15:string = "";
const get_U2hlZXQy_I15:string = "";
const get_U2hlZXQy_J15:string = "kuhjg";

    return (
      <div className="data-entry-mololith"><table><tbody>
<tr>
<td colSpan={1} rowSpan={1}>
iopl</td>
<td colSpan={1} rowSpan={1}>
Hello</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
How</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
<Radio.Group
                    options={[{ value: "Banana", label: "Banana" },{ value: "Fish", label: "Fish" },{ value: "Wing", label: "Wing" }]}
                    onChange={(e) => set_U2hlZXQx_B4(e.target.value)}
                  /></td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
<Select
            style={{ minWidth: "10rem" }}
            allowClear
            options={[{ value: "", label: "" }]}
            onChange={(value) => set_U2hlZXQx_A5(value)}
            /></td>
<td colSpan={1} rowSpan={1}>
gyn</td>
<td colSpan={1} rowSpan={1}>
<Select
            style={{ minWidth: "10rem" }}
            allowClear
            options={[{ value: "", label: "" }]}
            onChange={(value) => set_U2hlZXQx_C5(value)}
            /></td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
<Radio.Group
                    options={[{ value: "", label: "" }]}
                    onChange={(e) => set_U2hlZXQx_B6(e.target.value)}
                  /></td>
<td colSpan={1} rowSpan={1}>
lkj</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
<InputNumber<number>
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                onChange={(e) => set_U2hlZXQx_A7(e ?? 0)}
              /></td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
</tbody></table>
<table><tbody>
<tr>
<td colSpan={1} rowSpan={1}>
hjk</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
</tr>
<tr>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
</td>
<td colSpan={1} rowSpan={1}>
kuhjg</td>
</tr>
</tbody></table>

      </div>
    );
  };
  
  export default DataEntryMonolith;
  