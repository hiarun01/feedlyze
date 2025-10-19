import CreateProject from "@/components/CreateProject";

const page = () => {
  // const Project: {name: String; des: String}[] = [
  //   {
  //     name: "Jobify",
  //     des: "a job portal",
  //   },
  //   {
  //     name: "feedlyzer",
  //     des: "feedback collector",
  //   },
  // ];
  return (
    <div className="max-w-6xl mx-auto px-5 h-full lg:py-28 py-25 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center ">
      {/* Dashboard Header */}
      <div className="col-span-4 mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <CreateProject />
    </div>
  );
};

export default page;
