import HeroComponent from "@/components/Herocomponent";
import ProductCard from "@/components/ProductCard";
import Searchbar from "@/components/Searchbar";
import { GetAllProducts } from "@/lib/actions";
import Image from "next/image";
import React from "react";

async function Home() {
  const allProductsList = await GetAllProducts();

  function getLastAndReverse(arr: any, limit: number) {
    return arr?.slice(-limit).reverse(); // Take the last `limit` items and reverse them
  }
  
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> PriceWise</span>
            </h1>

            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>

            <Searchbar />
          </div>

          <HeroComponent />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {getLastAndReverse(allProductsList, 12)?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
