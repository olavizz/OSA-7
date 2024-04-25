import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const mockupdateLikes = vi.fn();
const mockremoveBlog = vi.fn();
const mockHandler = vi.fn(() => {
  console.log("Mockhandler kutsuttu");
});

test("renders blog", () => {
  const blog = {
    title: "Tämä on testi",
    author: "author",
    url: "url",
    likes: "3",
    user: {
      name: "Kalle",
    },
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Tämä on testi author");
  expect(element).toBeDefined();
});

// test('render url, likes, user', async () => {
//   const blog = {
//     title: 'Tämä on testi',
//     author: 'author',
//     url: 'url',
//     likes: '3',
//     user: {
//       name: 'Kalle'
//     }
//   }

//   render(<Blog blog={blog} toggleVisibility={mockHandler} updateLikes={mockupdateLikes} removeBlog={mockremoveBlog} />)
//   screen.debug()
//   const user = userEvent.setup()
//   console.log(user)
//   const button = screen.getByText('view')
//   user.click(button)
//   console.log(mockHandler.mock)
//   console.log(mockHandler.mock.calls)
//   await expect(mockHandler.mock.calls).toHaveLength(1)
// }
// )
