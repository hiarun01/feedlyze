import Link from "next/link";
import React from "react";
import {Button} from "./ui/button";

const ActionSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:py-20 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-black">
        Ready to transform your user feedback experience?
      </h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Join Feedlyze today and start turning feedback into actionable insights!
      </p>
      <div className="flex justify-center mt-8">
        <Link href="/register">
          <Button className="py-5 px-10 flex items-center gap-2 ">
            Get Started
          </Button>
        </Link>
        <Link href="/docs" className="ml-4">
          <Button
            variant="outline"
            className="py-5 px-5 flex items-center gap-2 bg-white"
          >
            Read Docs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActionSection;
