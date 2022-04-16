import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

/*
const StyledButton = styled(Button)(({ theme }) => {
	return({
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    &:hover {
      borderColor: '#ffffff'
    }
  }
  });
});*/

const StyledButton = styled(Button)`
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  :hover {
    border-color: #ffffff;
  }
`

const StyledFCL = styled(FormControlLabel)`
  color: rgba(255, 255, 255, 0.7);
`

export default function BasicPopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isChecked = (id) =>{
    return props.myBooks.map(b => b.bookId).includes(id);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <StyledButton aria-describedby={id} variant="outlined" onClick={handleClick}>
        Manage Books
      </StyledButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper>
          <FormGroup sx={{p:2}}>
            <Typography variant='subtitle1'>International Books</Typography>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={8} checked={isChecked(8)}/>} label="My Bookie"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={21} checked={isChecked(21)}/>} label="Bovada"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={1001} checked={isChecked(1001)}/>} label="Bet Online"/>
            <Divider sx={{my:1}}/>
            <Typography variant='subtitle1'>Michigan Books</Typography>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={351} checked={isChecked(351)}/>} label="PointsBet MI"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={355} checked={isChecked(355)}/>} label="Caesers MI"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={366} checked={isChecked(366)}/>} label="Fan Duel MI"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={283} checked={isChecked(283)}/>} label="Bet MGM MI"/>
            <StyledFCL  control={<Checkbox onChange={props.updateBooks} value={68} checked={isChecked(68)}/>} label="Draft Kings"/>
          </FormGroup>
        </Paper>
      </Popover>
    </div>
  );
}
