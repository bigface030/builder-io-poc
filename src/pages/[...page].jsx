// pages/[...page].tsx
import React from "react";
import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

// Define a function that fetches the Builder
// content for a given page
export const getStaticProps = async ({ params }) => {
  // Fetch the builder content for the given page
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/" + ((params?.page)?.join("/") || ""),
      },
    })
    .toPromise();

  console.log('[test] builder api called!')

  const data = {
    userName: "Ella Jones",
    isLogin: false,
  }

  // Return the page content as props
  return {
    props: {
      page: page || null,
      data: data || null,
    },
  };
};

// Define a function that generates the
// static paths for all pages in Builder
export async function getStaticPaths() {
  // Get a list of all pages in Builder
  const pages = await builder.getAll("page", {
    // We only need the URL field
    fields: "data.url",
    options: { noTargeting: true },
  });

  console.log('[test] builder api called!')

  // Generate the static paths for all pages in Builder
  return {
    paths: pages.map((page) => `${page.data?.url}`).filter(url => url !== '/'),
    fallback: 'blocking',
  };
}

// Define the Page component
export default function Page({ page, data }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  const context = {
    handleButtonClick: () => alert("hi!")
  }

  // If the page content is not available
  // and not in preview mode, show a 404 error page
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // If the page content is available, render
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data?.title}</title>
      </Head>
      {/* Render the Builder page */}
      <BuilderComponent
        model="page"
        content={page || undefined}
        data={data || undefined}
        context={context}
      />
    </>
  );
}
