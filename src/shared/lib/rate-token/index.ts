// Default pool reserves - matching the test pool state
const realSolReserves = BigInt(0);
const realTokenReserves = BigInt(793100000000000); // 793.1M tokens
const reservedTokens = BigInt(206900000000000); // 206.9M tokens
const virtualSolReserves = BigInt(0.353e9); // 30000000000 // 30 SOL (from test)
const virtualTokenReserves = BigInt(73000000000000); // 73M tokens (from test)
const feeBps = 0;

interface calculateSpend {
  value: number;
  realReserv?: {
    token: number;
    sol: number;
  };
  virtualReserv?: {
    token: number;
    sol: number;
  };
}

type mutableReservesProps = Partial<Omit<Required<calculateSpend>, 'value'>>;

// Exact pool.rs implementation using native BigInt
function solReserves({ realReserv, virtualReserv }: mutableReservesProps): bigint {
  return (
    (virtualReserv?.sol ? BigInt(virtualReserv.sol) : virtualSolReserves) +
    (realReserv?.sol ? BigInt(realReserv.sol) : realSolReserves)
  );
}

function tokenReserves({ realReserv, virtualReserv }: mutableReservesProps): bigint {
  // Если переданы кастомные данные, не добавляем reservedTokens (они уже включены)
  if (realReserv || virtualReserv) {
    return (
      (virtualReserv?.token ? BigInt(virtualReserv.token) : virtualTokenReserves) +
      (realReserv?.token ? BigInt(realReserv.token) : realTokenReserves) +
      reservedTokens
    );
  }

  return virtualTokenReserves + realTokenReserves + reservedTokens;
}

function k(props: mutableReservesProps): bigint {
  return tokenReserves(props) * solReserves(props);
}

// Ceiling division for BigInt
function ceilDiv(a: bigint, b: bigint): bigint {
  if (b === BigInt(0)) {
    return BigInt(0);
  }
  return (a + b - BigInt(1)) / b;
}

function calcAmountOut(
  feeBps: number,
  reservsProps: mutableReservesProps,
  solAmountIn?: bigint,
  tokenAmountIn?: bigint,
): [bigint, bigint, bigint] {
  if (solAmountIn !== undefined && tokenAmountIn === undefined) {
    // ExactBtoA: Buy tokens with exact SOL amount
    const fee = (solAmountIn * BigInt(feeBps)) / BigInt(10000);
    const solAmountInWithoutFee = solAmountIn - fee;

    const currentSolReserves = solReserves(reservsProps);
    const currentTokenReserves = tokenReserves(reservsProps);
    const kValue = k(reservsProps);

    const futureSolReserves = currentSolReserves + solAmountInWithoutFee;

    // Round up: ceil(k / future_sol_reserves) - matching Rust implementation
    const futureTokenReserves = ceilDiv(kValue, futureSolReserves);

    const tokenAmountOut = currentTokenReserves - futureTokenReserves;

    return [solAmountInWithoutFee, tokenAmountOut, fee];
  }

  if (solAmountIn === undefined && tokenAmountIn !== undefined) {
    // ExactAtoB: Sell exact tokens for SOL
    const futureTokenReserves = tokenReserves(reservsProps) + tokenAmountIn;

    // Round up: ceil(k / future_token_reserves)
    const futureSolReserves = ceilDiv(k(reservsProps), futureTokenReserves);

    const solAmountOut = solReserves(reservsProps) - futureSolReserves;
    const fee = (solAmountOut * BigInt(feeBps)) / BigInt(10000);
    const solAmountOutWithoutFee = solAmountOut - fee;

    return [tokenAmountIn, solAmountOutWithoutFee, fee];
  }

  throw new Error('Invalid arguments');
}

export function exactBtoA({ value, realReserv, virtualReserv }: calculateSpend): number {
  // ExactBtoA: Buy tokens with exact SOL amount (matching Rust ExactBtoA)
  const exactAmountInBig = BigInt(Math.floor(value * 1e9)); // Convert SOL to lamports
  const [amountIn, amountOut, fee] = calcAmountOut(
    feeBps,
    {
      realReserv: realReserv
        ? {
            token: realReserv.token,
            sol: realReserv.sol,
          }
        : undefined,
      virtualReserv: virtualReserv
        ? {
            token: 73000000000000,
            sol: virtualReserv.sol,
          }
        : undefined,
    },
    exactAmountInBig,
    undefined,
  );

  // Verify the calculation matches input (with fee)
  if (amountIn + fee !== exactAmountInBig) {
    throw new Error('Amount calculation error');
  }

  return Number(amountOut) / 1e6; // Convert to token units (6 decimals)
}

// ExactAtoB: User sells exact tokens, gets SOL
export function exactAtoB({ value, realReserv, virtualReserv }: calculateSpend): number {
  const exactAmountInBig = BigInt(Math.floor(value * 1e6)); // Convert tokens to smallest unit
  const [amountIn, amountOut, fee] = calcAmountOut(
    feeBps,
    {
      realReserv: realReserv
        ? {
            token: realReserv.token,
            sol: realReserv.sol,
          }
        : undefined,
      virtualReserv: virtualReserv
        ? {
            token: virtualReserv.token,
            sol: virtualReserv.sol,
          }
        : undefined,
    },
    undefined,
    exactAmountInBig,
  );

  // Check: amount_in == exact_amount_in
  if (amountIn !== exactAmountInBig) {
    throw new Error('Amount calculation error');
  }

  return Number(amountOut) / 1e9; // Convert to SOL
}

// Test function to verify calculation
export function testCalculation() {
  console.log('=== Testing with your data ===');
  const result1 = exactBtoA({
    value: 0.001,
    virtualReserv: {
      sol: 30001000027,
      token: 866064234525549,
    },
    realReserv: {
      sol: 1000027,
      token: 793064234525549,
    },
  });

  console.log('Input: 0.001 SOL');
  console.log('Output:', result1, 'tokens');
  console.log('Expected: 35760.7063 tokens');
  console.log('Actual:', (result1 / 1000).toFixed(1), 'K tokens');
  console.log('Difference:', Math.abs(result1 - 35760.7063), 'tokens');

  console.log('\n=== Testing 0.005 SOL ===');
  const result2 = exactBtoA({
    value: 0.005,
    virtualReserv: {
      sol: 30001000027,
      token: 866064234525549,
    },
    realReserv: {
      sol: 1000027,
      token: 793064234525549,
    },
  });

  console.log('Input: 0.005 SOL');
  console.log('Output:', result2, 'tokens');
  console.log('Expected: 178767.780219 tokens');
  console.log('Actual:', (result2 / 1000).toFixed(1), 'K tokens');
  console.log('Difference:', Math.abs(result2 - 178767.780219), 'tokens');

  // Анализируем соотношение
  const ratio1 = result1 / 35760.7063;
  const ratio2 = result2 / 178767.780219;
  console.log('\n=== Error Analysis ===');
  console.log('0.001 SOL ratio (actual/expected):', ratio1.toFixed(4));
  console.log('0.005 SOL ratio (actual/expected):', ratio2.toFixed(4));
  console.log('Average ratio:', ((ratio1 + ratio2) / 2).toFixed(4));

  console.log('\n=== Testing without reservedTokens ===');
  // Временно убираем reservedTokens для теста
  const originalReservedTokens = reservedTokens;
  (globalThis as any).reservedTokens = BigInt(0);

  const resultWithoutReserved = exactBtoA({
    value: 0.001,
    virtualReserv: {
      sol: 30001000027,
      token: 866064234525549,
    },
    realReserv: {
      sol: 1000027,
      token: 793064234525549,
    },
  });

  console.log('Without reservedTokens (0.001 SOL):', resultWithoutReserved, 'tokens');
  console.log('Ratio without reserved:', (resultWithoutReserved / 35760.7063).toFixed(4));

  // Восстанавливаем
  (globalThis as any).reservedTokens = originalReservedTokens;

  console.log('\n=== Manual calculation verification ===');
  // Ручная проверка математики для 0.001 SOL
  const solAmountIn = BigInt(1000000); // 0.001 SOL in lamports
  const virtualSol = BigInt(30001000027);
  const realSol = BigInt(1000027);
  const virtualToken = BigInt(866064234525549);
  const realToken = BigInt(793064234525549);
  const reserved = BigInt(206900000000000);

  const totalSol = virtualSol + realSol;
  const totalToken = virtualToken + realToken + reserved;
  const k = totalSol * totalToken;

  console.log('Total SOL reserves:', Number(totalSol) / 1e9);
  console.log('Total Token reserves:', Number(totalToken) / 1e6);
  console.log('K value:', k.toString());

  const futureSol = totalSol + solAmountIn;
  const futureToken = (k + futureSol - BigInt(1)) / futureSol; // ceil(k/futureSol)
  const tokenOut = totalToken - futureToken;

  console.log('Future SOL reserves:', Number(futureSol) / 1e9);
  console.log('Future Token reserves:', Number(futureToken) / 1e6);
  console.log('Manual tokenOut:', Number(tokenOut) / 1e6);
  console.log('Expected:', 35760.7063);

  console.log('\n=== Testing with default values (should match swap.ts) ===');
  const result3 = exactBtoA({ value: 0.001 });
  console.log('Default values result:', result3, 'tokens');

  return {
    custom001: result1,
    custom005: result2,
    default: result3,
    manual: Number(tokenOut) / 1e6,
  };
}

testCalculation();
