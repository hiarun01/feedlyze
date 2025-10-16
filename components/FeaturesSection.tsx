import {title} from "process";

const FeaturesSection = () => {
  const features = [
    {
      title: "Easy Integration",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      title: "Feature Two",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      title: "Feature Three",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      title: "Feature Three",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      title: "Feature Three",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      title: "Feature Three",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl lgpy-20 py-10">
      <h2 className="text-center font-extrabold lg:text-4xl text-3xl my-10">
        Our Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 px-5">
        {features.map((feature, index) => (
          <div key={index} className="border p-4  rounded-lg shadow ">
            <h3 className="font-bold">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
