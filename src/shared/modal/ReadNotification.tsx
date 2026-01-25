import React from "react";

const ReadNotification = ({ onClose, news }: any) => {
  const hasPayload = news?.payload && news?.payload?.application;

  return (
    <main className="font-outfit">
      <div className="m-auto w-[40em]">
        <div className="px-[1em] mt-[1em] flex flex-col gap-[1em]">
          <p className="font-normal text-gray-500">
            from:{" "}
            <span className="font-normal text-black">
              {hasPayload
                ? news.payload.application.email
                : news.from || "System Notification"}
            </span>
          </p>
          <header className="ml-2">
            <h1 className="font-semibold">
              {news?.topic || news?.description}
            </h1>
          </header>
          <hr />
          <div>
            <article className="text-gray-500 font-normal">
              <p>{news?.description}</p>
            </article>
          </div>

          {/* Payment Application Details */}
          {hasPayload && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-3">
                Application Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Application ID:
                  </span>
                  <span className="text-gray-800">
                    {news.payload.application.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Applicant Name:
                  </span>
                  <span className="text-gray-800">
                    {news.payload.application.firstName}{" "}
                    {news.payload.application.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">
                    {news.payload.application.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Phone Number:
                  </span>
                  <span className="text-gray-800">
                    {news.payload.application.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between py-[1.5em] mt-[2em] items-center px-[1em] bg-purple-white"></div>
      </div>
    </main>
  );
};

export default ReadNotification;
