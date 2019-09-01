import styled from "styled-components";

export const Button = styled.button`
  border: 1px solid #412e61;
  color: #fff;
  text-shadow: 0 1px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  cursor: pointer;
  margin-top: 6.5px;
  margin-bottom: 6.5px;
  background-image: linear-gradient(to bottom, #4d3672 0, #412e61 100%);
  text-align: center;
  vertical-align: middle;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.7;
  border-radius: 4px;
  -webkit-text-decoration: none;
  text-decoration: none;
  outline: none;
  transition: background-image 200ms, opacity 200ms;

  :disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background-image: linear-gradient(to bottom, #4d3672 0, #412e61 100%);

    :hover {
      background-image: linear-gradient(to bottom, #4d3672 0, #412e61 100%);
    }
  }

  :hover {
    border: 1px solid #36264f;
    background-image: linear-gradient(to bottom, #4d3672 0, #36264f 100%);
  }
`;
export default Button;
