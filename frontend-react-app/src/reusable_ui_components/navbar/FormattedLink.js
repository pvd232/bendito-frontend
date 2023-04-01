import { Link as RRLink } from 'react-router-dom';

const FormattedLink = (props) => (
  <RRLink
    to={props.url}
    style={{
      textDecoration: 'none',
      color: 'black',
      fontSize: props.customTheme.fontSize.linkText,
    }}
  >
    {props.text}
  </RRLink>
);
export default FormattedLink;
