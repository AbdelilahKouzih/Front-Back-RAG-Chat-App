import React from "react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

interface PricingCardPropsType {
  title: string;
  desc: string;
  price: string[];
  options: {
    icon: React.ReactNode;
    info: string;
  }[];
  icon: React.ReactNode;
  children: React.ReactNode;
}

function PricingCard({ title, desc, price, options }: PricingCardPropsType) {
  return (
    <Card variant="gradient" color="white">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="!m-0 p-6"
      >
        <Typography
          variant="h6"
          color="white"
          className="capitalize font-bold mb-1"
        >
          {title}
        </Typography>
        <Typography
          variant="small"
          className="font-normal !text-gray-500"
        >
          {desc}
        </Typography>
        <Typography
          variant="h3"
          color="blue-gray"
          className="!mt-4 flex gap-1 !text-4xl"
        >
          {price[0]}
          {price[1]}
          <Typography
            as="span"
            color="blue-gray"
            className="-translate-y-0.5 self-end opacity-70 text-lg font-bold"
          >
            /{price[2]}
          </Typography>
        </Typography>
      </CardHeader>
      <CardBody className="pt-0">
        <ul className="flex flex-col gap-3 mb-6">
          {options.map((option, key) => (
            <li
              key={key}
              className="flex items-center gap-3 text-gray-700"
            >
              {option.icon}
              <Typography
                variant="small"
                className="font-normal text-inherit"
              >
                {option.info}
              </Typography>
            </li>
          ))}
        </ul>
        <Button fullWidth variant="gradient" color="gray">
          get started
        </Button>
      </CardBody>
    </Card>
  );
}

export function PricingSection11() {
  const cards = [
    {
      title: "starter",
      desc: "Free access for 2 members",
      price: ["$", "129", "year"],
      options: [
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Complete documentation",
        },
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Working materials in Sketch",
        },
        {
          icon: (
            <MinusCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Integration help",
        },
        {
          icon: (
            <MinusCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "40GB Cloud storage",
        },
        {
          icon: (
            <MinusCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Support team full assist",
        },
      ],
    },
    {
      title: "premium",
      desc: "Free access for 30 members",
      price: ["$", "299", "year"],
      options: [
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Complete documentation",
        },
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Working materials in Sketch",
        },
        {
          icon: (
            <CheckCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Integration help",
        },
        {
          icon: (
            <CheckCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "40GB Cloud storage",
        },
        {
          icon: (
            <MinusCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Support team full assist",
        },
      ],
    },
    {
      title: "company",
      desc: "Free access for 200 members",
      price: ["$", "399", "year"],
      options: [
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Complete documentation",
        },
        {
          icon: (
            <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />
          ),
          info: "Working materials in Sketch",
        },
        {
          icon: (
            <CheckCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Integration help",
        },
        {
          icon: (
            <CheckCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "40GB Cloud storage",
        },
        {
          icon: (
            <CheckCircleIcon
              strokeWidth={2.5}
              className="h-5 w-5 text-blue-gray-900"
            />
          ),
          info: "Support team full assist",
        },
      ],
    },
  ];

  return (
    <div id="pricing" className="antialiased w-[80%]   m-auto h-full bg-[#020617] text-gray-400 font-inter p-10">
    <div className="container px-4 mx-auto">
      <div>
        <div id="title" className="text-center my-10">
          <h1 className="font-bold text-4xl text-white">Pricing Plans</h1>
          <p className="text-light text-gray-500 text-xl">
            Here are our pricing plans
          </p>
        </div>
        <div
          className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-10 pt-10"
        >
          <div
            id="plan"
            className="rounded-lg border bg-[#020617] text-center overflow-hidden w-full transform hover:shadow-2xl hover:scale-105 transition duration-200 ease-in"
          >
            <div id="title" className="w-full py-5 border-b border-gray-800">
              <h2 className="font-bold text-3xl text-white">Startup</h2>
              <h3 className="font-normal text-slate-500 text-indigo-500 text-xl mt-2">
                $9<sup>,99</sup>/month
              </h3>
            </div>
            <div id="content" className="">
              <div id="icon" className="my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto fill-stroke text-[#0284c7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 text-sm pt-2">
                  Perfect individuals or startups
                </p>
              </div>
              <div id="contain" className="leading-8 mb-10 text-lg font-light">
                <ul>
                  <li>10 hours of support</li>
                  <li>128MB of storage</li>
                  <li>2048MB bandwith</li>
                  <li>Subdomain included</li>
                </ul>
                <div id="choose" className="w-full mt-10 px-6">
                  <a
                    href="#"
                    className="w-full block rounded-lg border font-medium text-gray-300 text-xl py-4 rounded-xl hover:shadow-lg transition duration-200 ease-in-out hover:bg-indigo-100 hover:text-black"
                    >Choose</a>
                </div>
              </div>
            </div>
          </div>
          <div
            id="plan"
            className="rounded-lg border bg-[#020617] text-center overflow-hidden w-full transform hover:shadow-2xl hover:scale-105 transition duration-200 ease-in"
          >
            <div id="title" className="w-full py-5 border-b border-gray-800">
              <h2 className="font-bold text-3xl text-white">Corporate</h2>
              <h3 className="font-normal text-slate-500 text-indigo-500 text-xl mt-2">
                $12<sup>,99</sup>/month
              </h3>
            </div>
            <div id="content" className="">
              <div id="icon" className="my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto fill-stroke text-[#0284c7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <p className="text-gray-500 text-sm pt-2">
                  Perfect for teams up to 12 people
                </p>
              </div>
              <div id="contain" className="leading-8 mb-10 text-lg font-light">
                <ul>
                  <li>10 hours of support</li>
                  <li>1024MB of storage</li>
                  <li>4GB bandwith</li>
                  <li>Domain included</li>
                </ul>
                <div id="choose" className="w-full mt-10 px-6">
                  <a
                    href="#"
                    className="w-full block border border-gray-300 font-medium text-gray-300 text-xl py-4 rounded-xl hover:shadow-lg transition duration-200 ease-in-out hover:bg-indigo-100 hover:text-black"
                    >Choose</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            id="plan"
            className="rounded-lg border bg-[#020617] border-gray-800  text-center overflow-hidden w-full transform hover:shadow-2xl hover:scale-105 transition duration-200 ease-in"
          >
            <div id="title" className="w-full py-5 border-b border-gray-800">
              <h2 className="font-bold text-3xl text-white">Enterprise</h2>
              <h3 className="font-normal text-slate-500 text-indigo-500 text-xl mt-2">
                $19<sup>,99</sup>/month
              </h3>
            </div>
            <div id="content" className="">
              <div id="icon" className="my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto fill-stroke text-[#0284c7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-gray-500 text-sm pt-2">
                  Perfect large scale team
                </p>
              </div>
              <div id="contain" className="leading-8 mb-10 text-lg font-light">
                <ul>
                  <li>10 hours of support</li>
                  <li>10GB of storage</li>
                  <li>100GB bandwith</li>
                  <li>Domain included</li>
                </ul>
                <div id="choose" className="w-full mt-10 px-6">
                  <a
                    href="#"
                    className="w-full block border border-gray-800  font-medium text-gray-300 text-xl py-4 rounded-xl hover:shadow-lg transition duration-100 ease-in-out hover:bg-indigo-100 hover:text-black"
                    >Choose</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default PricingSection11;