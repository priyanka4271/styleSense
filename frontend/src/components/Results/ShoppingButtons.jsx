const appendBudgetHint = (url, budget) => {
  const encoded = encodeURIComponent(budget);
  if (url.includes("myntra.com")) return `${url}&budget=${encoded}`;
  if (url.includes("flipkart.com")) return `${url}&p%5B%5D=facets.price_range.from%3D${encoded}`;
  return url;
};

export default function ShoppingButtons({ links, budget }) {
  const buttons = [
    { label: "Shop on Myntra", href: appendBudgetHint(links.myntra, budget), style: "from-pink-500 to-fuchsia-500" },
    { label: "Shop on Flipkart", href: appendBudgetHint(links.flipkart, budget), style: "from-sky-500 to-indigo-500" },
    { label: "Shop on Meesho", href: appendBudgetHint(links.meesho, budget), style: "from-orange-500 to-rose-500" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {buttons.map((button) => (
        <a
          key={button.label}
          href={button.href}
          target="_blank"
          rel="noreferrer"
          className={`rounded-2xl bg-gradient-to-r ${button.style} px-4 py-3 text-center text-sm font-semibold text-white transition hover:scale-[1.02]`}
        >
          {button.label}
        </a>
      ))}
    </div>
  );
}
