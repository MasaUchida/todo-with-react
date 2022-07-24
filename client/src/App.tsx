import useSWR from "swr";
import "./App.css";
import { Box, List, ThemeIcon } from "@mantine/core";
import AddTodo from "../components/AddTodo";
import { CheckCircleFillIcon } from "@primer/octicons-react";

export type Todo = {
  id: number;
  title: string;
  body: string;
  done: boolean;
};

//API側のポートと合わせること　なんか競合すると動かない8080だとダメだった
export const ENDPOINT = "http://localhost:7777";

const fetcher = (url: string) => {
  return fetch(`${ENDPOINT}/${url}`).then((r) => {
    return r.json();
  });
};

function App() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  const markTodoAdDone = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PATCH",
    }).then((r) => {
      return r.json();
    });

    mutate(updated);
  };

  return (
    <Box
      sx={(theme) => ({
        padding: "2rem",
        width: "100%",
        maxWidth: "40rem",
        margin: "0 auto",
      })}
    >
      <List spacing="xs" size="sm" mb={12} center>
        {data?.map((todo) => {
          return (
            <List.Item
              onClick={() => {
                markTodoAdDone(todo.id);
              }}
              key={`todo_${todo.id}`}
              icon={
                todo.done ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
            </List.Item>
          );
        })}
      </List>

      <AddTodo mutate={mutate}></AddTodo>
    </Box>
  );
}

export default App;

//{JSON.stringify(data)}
