import React from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';

type DropDownProps = {
  onChange: any;
  menuOption: { value: string | number; itemLabel: string | number }[];
  name?: string;
  defaultValue?: string | number;
};

const DropDown: React.FC<DropDownProps> = ({
  onChange,
  menuOption,
  name,
  defaultValue,
}) => (
  <div style={{ margin: '0 15px' }}>
    <FormControl>
      <Select onChange={onChange} name={name} defaultValue={defaultValue}>
        {menuOption.map(({ value, itemLabel }, index) => (
          <MenuItem value={value} key={index}>
            {itemLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
);

export default DropDown;
