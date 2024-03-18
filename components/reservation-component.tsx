import React from "react";
import Head from "next/head";

export default function ReservationComponent({ restaurant }) {
  const scriptSrc = `//www.opentable.com/widget/reservation/loader?rid=${restaurant.slug}&type=button&theme=standard&color=1&iframe=true&domain=com&lang=en-US&newtab=false&ot_source=Restaurant%20website`;

  return (
    <div>
      <h3>{restaurant.slug}</h3>
      <Head>
        <script type="text/javascript" src={scriptSrc} async />
      </Head>
    </div>
  );
}
