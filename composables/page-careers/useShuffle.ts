// composable para shuffle determinístico com seed persistida
// uso: const shuffle = createShuffle(); const opts = shuffle.getShuffled(groups, namespace);
export function createShuffle(config?: { storageKeyPrefix?: string }) {
  const prefix = config?.storageKeyPrefix ?? 'mediari.profileTest.seed';

  function mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle<T>(arr: T[], rng: () => number) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeSeed(): number {
    try {
      const u = new Uint32Array(1);
      crypto.getRandomValues(u);
      return u[0] >>> 0;
    } catch {
      // Fallback para ambientes sem crypto
      return Math.floor(Math.random() * 0xffffffff) >>> 0;
    }
  }

  function hashGroups(groups: Array<Record<string, string>>) {
    try {
      const s = JSON.stringify(groups.map((g) => [g.A, g.B, g.C, g.D]));
      let h = 5381;
      for (let i = 0; i < s.length; i++) {
        h = (h << 5) + h + s.charCodeAt(i);
      }
      return (h >>> 0).toString(36);
    } catch {
      return 'v0';
    }
  }

  function storageAvailable() {
    try {
      const k = '__mediari_test__';
      localStorage.setItem(k, k);
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  }

  function getStorageKey(namespace: string, groupHash: string) {
    return `${prefix}:${namespace}:${groupHash}`;
  }

  function readSeed(storageKey: string): number | null {
    try {
      const s = localStorage.getItem(storageKey);
      if (!s) return null;
      const n = Number(s);
      return Number.isFinite(n) ? n >>> 0 : null;
    } catch {
      console.warn('[createShuffle] falha ao ler seed do localStorage');
      return null;
    }
  }

  function writeSeed(storageKey: string, seed: number) {
    try {
      localStorage.setItem(storageKey, String(seed));
    } catch (e) {
      console.warn('[createShuffle] falha ao gravar seed no localStorage', e);
    }
  }

  function clearSeed(storageKey: string) {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('[createShuffle] clearSeed failed', e);
    }
  }

  return {
    getShuffled(
      groups: Array<Record<string, string>>,
      namespace = 'default',
      forceNew = false
    ) {
      if (typeof window === 'undefined') {
        // SSR: devolver ordem natural para evitar mismatch
        return (groups || []).map((g) =>
          ['A', 'B', 'C', 'D'].map((k) => ({ key: k, label: g[k] }))
        );
      }

      const groupHash = hashGroups(groups || []);
      const storageKey = getStorageKey(namespace, groupHash);

      let seed = null;
      if (!forceNew && storageAvailable()) seed = readSeed(storageKey);
      if (seed === null || forceNew) {
        seed = makeSeed();
        if (storageAvailable()) writeSeed(storageKey, seed);
      }

      return (groups || []).map((g, idx) => {
        const keys = ['A', 'B', 'C', 'D'];
        const opts = keys.map((k) => ({ key: k, label: g[k] }));
        const rng = mulberry32((seed + idx + 1) >>> 0);
        return seededShuffle(opts, rng);
      });
    },
    regenerateSeed(
      groups: Array<Record<string, string>>,
      namespace = 'default'
    ) {
      if (typeof window === 'undefined') return;
      const groupHash = hashGroups(groups || []);
      const storageKey = getStorageKey(namespace, groupHash);
      const seed = makeSeed();
      if (storageAvailable()) writeSeed(storageKey, seed);
      return seed;
    },
    clearSeedFor(groups: Array<Record<string, string>>, namespace = 'default') {
      if (typeof window === 'undefined') return;
      const groupHash = hashGroups(groups || []);
      const storageKey = getStorageKey(namespace, groupHash);
      clearSeed(storageKey);
    },
  };
}

export default createShuffle;
