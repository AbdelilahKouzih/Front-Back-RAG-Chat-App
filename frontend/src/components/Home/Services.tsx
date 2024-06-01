import Section from "./Section";
import service1 from "./assets/s1.png";
import service2 from "./assets/robot-6654030_1280.png";
import service3 from "./assets/robot-6654032_1280.png";
import check from "./assets/icons8-check-48.png";
import recording03 from "./assets/recording-03.svg";
import recording01 from "./assets/recording-01.svg";
import disc02 from "./assets/disc-02.svg";
import chromecast from "./assets/chrome-cast.svg";
import sliders04 from "./assets/sliders-04.svg";
import 'animate.css'; // Import animate.css

export const chatbotServices = [
    "Communicate with Your Data",
    "Web Search Assistance",
    "Voice Chat Capabilities",
];

export const chatbotServicesIcons = [
    recording03,
    recording01,
    disc02,
    chromecast,
    sliders04,
];

const Services = () => {
  return (
    <Section  className=" animate__animated animate__fadeIn animate__slow w-[80%] m-auto">
      <div id="how-to-use" className="container">
        <div  className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-gray-300 rounded-3xl overflow-hidden lg:p-20 xl:h-[40rem]">
            <div className="absolute top-0 left-0  right-80 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-cover md:object-right"
                width={800}
                alt="Smartest AI"
                height={730}
                src={service1}
              />
            </div>

            <div className="relative z-1 max-w-[17rem] ml-auto">
              <h4 className="text-xl lg:text-2xl font-semibold mb-4">AI Communication</h4>
              <p className="text-base lg:text-lg text-gray-700 mb-[3rem]">
                Our AI-powered chatbot allows you to communicate seamlessly with your own data.
              </p>
              <ul className="text-base lg:text-lg text-gray-700">
                {chatbotServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center py-4 border-t border-gray-300"
                  >
                    <img width={24} height={24} src={check} alt="Check mark" />
                    <p className="ml-4">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="relative z-1 grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[39rem] border border-gray-300 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={service2}
                  className="h-[80%] w-full object-cover"
                  width={630}
                  height={750}
                  alt="Web Search"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-gray-800 to-gray-900 lg:p-15">
                <h4 className="text-xl lg:text-2xl font-semibold mb-4 text-white">Web Search</h4>
                <p className="text-base lg:text-lg text-gray-300 mb-[3rem]">
                  Let our AI assistant help you find what you're looking for on the web.
                </p>
              </div>


            </div>

            <div className="p-4 bg-gray-900 rounded-3xl overflow-hidden lg:min-h-[46rem]">
              <div className="py-12 px-4 xl:px-8">
                <h4 className="text-xl lg:text-2xl font-semibold mb-4 text-white">Voice Chat</h4>
                <p className="text-base lg:text-lg text-gray-300 mb-[2rem]">
                  Engage in conversations with our chatbot using voice commands for a more interactive experience.
                </p>

                <ul className="flex items-center justify-between">
                  {chatbotServicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`rounded-2xl flex items-center justify-center ${
                        index === 2
                          ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                          : "flex w-10 h-10 bg-gray-800 md:w-15 md:h-15"
                      }`}
                    >
                      <div
                        className={
                          index === 2
                            ? "flex items-center justify-center w-full h-full bg-gray-800 rounded-[1rem]"
                            : ""
                        }
                      >
                        <img src={item} width={24} height={24} alt={item} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative h-[20rem] bg-gray-800 rounded-xl overflow-hidden md:h-[25rem]">
                <img
                  src={service3}
                  className="w-full h-[90%] object-cover"
                  width={500}
                  height={350}
                  alt="Voice Chat"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
