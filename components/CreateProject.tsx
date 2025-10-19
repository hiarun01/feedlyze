/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {PlusIcon} from "lucide-react";
import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Card, CardContent} from "./ui/card";
import {useState} from "react";

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handler....
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // api call
    } catch (error: any) {
      setError(error.message || "Failed to create project. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger className="" asChild>
          <Card className="px-20 py-20 flex items-center justify-center cursor-pointer">
            <CardContent className="flex flex-col items-center ">
              <PlusIcon />
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Add New Project to manage your feedback effectively.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col justify-center"
          >
            <div className="mb-4">
              <Label htmlFor="name" className="block mb-2">
                Project Name
              </Label>
              <Input
                type="text"
                name="name"
                className="border border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter project name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="description" className="block mb-2">
                Project Description
              </Label>
              <Input
                type="text"
                name="description"
                className="border border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter project description"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="url" className="block mb-2">
                Project URL
              </Label>
              <Input
                type="text"
                name="url"
                className="border border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter project url"
              />
            </div>
            <Button className="mt-2">
              {loading ? "Creating..." : "Create Project"}
            </Button>
            <div className="mt-5">
              {error && (
                <div className="col-span-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProject;
