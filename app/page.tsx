"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { IBM_Plex_Sans } from "next/font/google";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value || 0);
}

function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className="group relative ml-2 inline-flex align-middle"
    >
      <button
        type="button"
        aria-label="Show more information"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-[#B8C3CF] text-xs font-semibold text-[#5B6470]"
      >
        i
      </button>

      <span
        className={`pointer-events-none absolute left-0 top-7 z-20 w-72 rounded-xl bg-[#111827] px-3 py-2 text-left text-xs font-normal leading-5 text-white shadow-lg transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {text}
      </span>
    </span>
  );
}

function InputLabel({
  label,
  required = false,
  tooltip,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="mb-2 flex items-center">
      <span className="text-sm font-medium text-[#111827]">{label}</span>
      <span
        className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
          required
            ? "bg-[#DDF4EC] text-[#0A514A]"
            : "bg-[#EEF2F7] text-[#5B6470]"
        }`}
      >
        {required ? "Required" : "Optional"}
      </span>
      {tooltip ? <InfoTooltip text={tooltip} /> : null}
    </div>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix: string;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-2xl border border-[#CDD5DF] bg-white focus-within:border-[#0A514A] focus-within:ring-2 focus-within:ring-[#CFEA86]">
      <span className="px-4 text-xl text-[#6B7280]">$</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full border-0 px-0 py-4 text-2xl outline-none placeholder:text-[#9CA3AF]"
        placeholder={placeholder}
      />
      <span className="whitespace-nowrap px-4 text-xl text-[#6B7280]">
        {suffix}
      </span>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix: string;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-2xl border border-[#CDD5DF] bg-white focus-within:border-[#0A514A] focus-within:ring-2 focus-within:ring-[#CFEA86]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        className="w-full border-0 px-4 py-4 text-2xl outline-none placeholder:text-[#9CA3AF]"
        placeholder={placeholder}
      />
      <span className="whitespace-nowrap px-4 text-xl text-[#6B7280]">
        {suffix}
      </span>
    </div>
  );
}

export default function Home() {
  const [hourlyCost, setHourlyCost] = useState("20");
  const [monthlyHours, setMonthlyHours] = useState("50000");
  const [monthlyCases, setMonthlyCases] = useState("20000");

  const [annualNonLaborCosts, setAnnualNonLaborCosts] = useState("");
  const [annualBenefitsSpend, setAnnualBenefitsSpend] = useState("");
  const [annualLeadershipCosts, setAnnualLeadershipCosts] = useState("");

  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const hourlyCostNumber = parseNumber(hourlyCost);
  const monthlyHoursNumber = parseNumber(monthlyHours);
  const monthlyCasesNumber = parseNumber(monthlyCases);

  const annualNonLaborCostsNumber = parseNumber(annualNonLaborCosts);
  const annualBenefitsSpendNumber = parseNumber(annualBenefitsSpend);
  const annualLeadershipCostsNumber = parseNumber(annualLeadershipCosts);

  const monthlyAgentWages = useMemo(() => {
    return hourlyCostNumber * monthlyHoursNumber;
  }, [hourlyCostNumber, monthlyHoursNumber]);

  const monthlyNonHeadcountCosts = useMemo(() => {
    return annualNonLaborCostsNumber / 12;
  }, [annualNonLaborCostsNumber]);

  const monthlyBenefits = useMemo(() => {
    return annualBenefitsSpendNumber / 12;
  }, [annualBenefitsSpendNumber]);

  const monthlyLeadershipCosts = useMemo(() => {
    return annualLeadershipCostsNumber / 12;
  }, [annualLeadershipCostsNumber]);

  const monthlyCost = useMemo(() => {
    return (
      monthlyAgentWages +
      monthlyLeadershipCosts +
      monthlyBenefits +
      monthlyNonHeadcountCosts
    );
  }, [
    monthlyAgentWages,
    monthlyLeadershipCosts,
    monthlyBenefits,
    monthlyNonHeadcountCosts,
  ]);

  const costPerCase = useMemo(() => {
    if (!monthlyCasesNumber) return 0;
    return monthlyCost / monthlyCasesNumber;
  }, [monthlyCost, monthlyCasesNumber]);

  return (
    <div
      className={`${plex.className} min-h-screen text-[#111827]`}
      style={{
        background: "linear-gradient(180deg, #CFE8E2 0%, #9FC7C0 100%)",
      }}
    >
      <div className="w-full px-8 py-12 md:px-12 lg:px-16">
        <div className="mb-10 max-w-[1320px] border-b border-black/10 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Image src="/logo.jpg" alt="logo" width={40} height={40} />
            </div>
            <h1 className="text-left text-4xl font-semibold tracking-tight md:text-5xl">
              Cost to Serve Calculator
            </h1>
          </div>

          <p className="max-w-3xl text-left text-lg leading-8 text-[#374151]">
            Estimate your cost per case using inputs from your team. Required
            fields give you a quick baseline, and optional fields help make your
            result more fully loaded.
          </p>
        </div>

        <div className="grid max-w-[1320px] items-stretch gap-8 xl:grid-cols-[1.2fr_1fr]">
          <div className="h-full rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-[#0A514A]">
                Let&apos;s dive in...
              </p>
              <h2 className="text-left text-2xl font-semibold tracking-tight">
                Your inputs
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <InputLabel
                  label="Average hourly wage per agent"
                  required
                  tooltip="Use an average of hourly wages across all agents, ex. $20, $22, etc."
                />
                <MoneyInput
                  value={hourlyCost}
                  onChange={setHourlyCost}
                  placeholder="20"
                  suffix="/ hour"
                />
              </label>

              <label className="block">
                <InputLabel
                  label="Total monthly labor hours"
                  required
                  tooltip="Total paid hours across all agents in a typical month, ex. 10000."
                />
                <NumberInput
                  value={monthlyHours}
                  onChange={setMonthlyHours}
                  placeholder="50000"
                  suffix="/ month"
                />
              </label>

              <label className="block">
                <InputLabel
                  label="Average cases solved per month"
                  required
                  tooltip="Total cases solved in a typical month across all channels, ex: 20000."
                />
                <NumberInput
                  value={monthlyCases}
                  onChange={setMonthlyCases}
                  placeholder="20000"
                  suffix="/ month"
                />
              </label>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowOptionalFields((prev) => !prev)}
                className="rounded-full border border-[#0A514A] bg-white px-4 py-2 text-sm font-medium text-[#0A514A] transition hover:bg-[#0A514A] hover:text-white"
              >
                {showOptionalFields
                  ? "Hide optional fields"
                  : "Show optional fields"}
              </button>
            </div>

            {showOptionalFields ? (
              <div className="mt-8 grid gap-6 border-t border-black/10 pt-8 md:grid-cols-2">
                <label className="block">
                  <InputLabel
                    label="Annual non-headcount costs"
                    tooltip="Examples include spend on software, vendors, hardware, and other non-labor expenses."
                  />
                  <MoneyInput
                    value={annualNonLaborCosts}
                    onChange={setAnnualNonLaborCosts}
                    placeholder="120000"
                    suffix="/ year"
                  />
                </label>

                <label className="block">
                  <InputLabel
                    label="Annual benefits spend"
                    tooltip="Examples include health insurance, wellness stipends, retirement contributions, and other non-salary benefits."
                  />
                  <MoneyInput
                    value={annualBenefitsSpend}
                    onChange={setAnnualBenefitsSpend}
                    placeholder="80000"
                    suffix="/ year"
                  />
                </label>

                <label className="block">
                  <InputLabel
                    label="Annual leadership salary costs"
                    tooltip="Examples include supervisors, team leads, workforce management, and operations support salaries."
                  />
                  <MoneyInput
                    value={annualLeadershipCosts}
                    onChange={setAnnualLeadershipCosts}
                    placeholder="250000"
                    suffix="/ year"
                  />
                </label>
              </div>
            ) : null}

            <div className="mt-8 rounded-2xl bg-white/70 px-4 py-4 text-left text-sm leading-6 text-[#4B5563]">
              Required fields give you a baseline estimate. Optional fields help
              make your cost per case more accurate.
            </div>
          </div>

          <div className="h-full rounded-[32px] bg-[#0A514A] p-3 shadow-[0_24px_60px_rgba(10,81,74,0.18)]">
            <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#11635B_0%,#0A514A_100%)] text-white">
              <div className="border-b border-white/10 px-6 py-5 md:px-8">
                <p className="text-left text-sm font-medium uppercase tracking-[0.14em] text-[#D7F15F]">
                  Result
                </p>
                <h2 className="mt-2 text-left text-2xl font-semibold tracking-tight">
                  Estimated cost per case
                </h2>
              </div>

              <div className="px-6 py-8 text-left md:px-8 md:py-10">
                <div className="text-5xl font-semibold tracking-tight md:text-7xl">
                  {formatCurrency(costPerCase)}
                </div>
                <div className="mt-2 text-xl text-white/80">per case</div>
              </div>

              <div className="border-t border-white/10 px-6 py-6 md:px-8">
                <div className="mb-2 text-right text-lg font-medium text-white/75">
                  Monthly
                </div>

                <div className="space-y-4 text-lg">
                  <div className="flex justify-between gap-4">
                    <span className="text-white/80">Agent wages</span>
                    <span className="font-semibold">
                      {formatCurrency(monthlyAgentWages)}
                    </span>
                  </div>

                  {monthlyLeadershipCosts > 0 ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-white/80">Leadership costs</span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyLeadershipCosts)}
                      </span>
                    </div>
                  ) : null}

                  {monthlyBenefits > 0 ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-white/80">Benefits</span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyBenefits)}
                      </span>
                    </div>
                  ) : null}

                  {monthlyNonHeadcountCosts > 0 ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-white/80">
                        Non-headcount costs
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyNonHeadcountCosts)}
                      </span>
                    </div>
                  ) : null}

                  <div className="border-t border-white/10 pt-4"></div>

                  <div className="flex justify-between gap-4 text-xl">
                    <span className="font-medium text-white/90">Total costs</span>
                    <span className="font-semibold">
                      {formatCurrency(monthlyCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-white/10 bg-black/10 px-6 py-5 text-left text-sm text-white/85 md:px-8">
                Formula:{" "}
                <span className="font-medium text-white">
                  ((hourly wage × monthly labor hours) + optional annual costs ÷
                  12) ÷ monthly cases solved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}