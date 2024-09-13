import App from "./App";
import { shallow } from "enzyme";

test("renders learn react link", () => {
  const app = shallow(<App />);
  expect(app).toBeInTheDocument();
});
