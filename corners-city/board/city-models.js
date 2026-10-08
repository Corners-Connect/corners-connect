// Clean geometry adaptation from Freedom twin-mundo/js/mapa.js.
// Only boxes, windows, seven building silhouettes and the generic robot are reused.
// No business data, role accessories, transports or client sources are included.
import * as THREE from './city-assets/three.module.min.js';
export const COLORS = { chocolate: '#5A422F', blue: '#A8DDFB', vivid: '#6BCBFF', shade: '#54B0E5' };
const C = { navy: COLORS.blue };
const mat = color => new THREE.MeshLambertMaterial({color});
const M = { navy: mat(COLORS.vivid), navyClaro: mat(COLORS.shade),
 celeste: mat(COLORS.blue), celesteSuave: mat(COLORS.blue), muro: mat(COLORS.vivid),
 blanco: mat(COLORS.blue), verde: new THREE.MeshBasicMaterial({color:COLORS.blue}) };
function caja(grupo, [w, h, d], [x, y, z], material, sombra = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = sombra; m.receiveShadow = true;
  grupo.add(m);
  return m;
}

function ventanas(grupo, [w, d], y0, pisos, alto, cx, cz, material = M.celeste) {
  for (let p = 0; p < pisos; p++) {
    const y = y0 + p * alto + alto * 0.35;
    caja(grupo, [0.06, alto * 0.38, d * 0.84], [cx + w / 2 + 0.03, y, cz], material, false);
    caja(grupo, [w * 0.84, alto * 0.38, 0.06], [cx, y, cz + d / 2 + 0.03], material, false);
  }
}

const EDIFICIOS = {
  torre(g) {
    caja(g, [3.6, 0.6, 3.6], [0, 0, 0], M.navy);
    caja(g, [3.2, 7.2, 3.2], [0, 0.6, 0], M.navyClaro);
    ventanas(g, [3.2, 3.2], 0.6, 7, 1.0, 0, 0);
    caja(g, [3.5, 0.35, 3.5], [0, 7.8, 0], M.navy);
    caja(g, [1.2, 0.8, 1.2], [-0.6, 8.15, -0.6], M.muro);
    caja(g, [0.08, 1.6, 0.08], [-0.6, 8.95, -0.6], M.navy);
    return 10.2;
  },
  oficina(g) {
    caja(g, [5, 3.4, 3.4], [0, 0, 0], M.muro);
    ventanas(g, [5, 3.4], 0.2, 3, 1.05, 0, 0, M.celeste);
    caja(g, [5.2, 0.3, 3.6], [0, 3.4, 0], M.navy);
    caja(g, [1.6, 0.7, 1.2], [1.2, 3.7, -0.6], M.celesteSuave);
    caja(g, [1.4, 1.2, 0.5], [1.2, 0, 1.95], M.navy);
    return 4.6;
  },
  biblioteca(g) {
    caja(g, [5.2, 0.5, 4], [0, 0, 0], M.navy);
    caja(g, [4.6, 2.6, 3.4], [0, 0.5, 0], M.muro);
    for (let i = -2; i <= 2; i++) caja(g, [0.32, 2.6, 0.32], [i * 1.05, 0.5, 1.95], M.blanco);
    caja(g, [5, 0.35, 4], [0, 3.1, 0], M.navy);
    caja(g, [3.6, 0.9, 2.8], [0, 3.45, 0], M.navyClaro);
    ventanas(g, [4.6, 3.4], 0.5, 1, 2.4, 0, 0, M.celesteSuave);
    return 5;
  },
  estudio(g) {
    caja(g, [4.2, 3.8, 4.2], [0, 0, 0], M.navy);
    caja(g, [3.4, 2.8, 0.08], [0, 0.5, 2.12], M.celeste, false);
    caja(g, [0.08, 2.8, 3.4], [2.12, 0.5, 0], M.celesteSuave, false);
    caja(g, [4.4, 0.25, 4.4], [0, 3.8, 0], M.navyClaro);
    caja(g, [1.4, 1.4, 1.4], [-1, 4.05, -1], M.muro);
    return 5.6;
  },
  nave(g) {
    caja(g, [5.6, 2.6, 4.2], [0, 0, 0], M.muro);
    for (let i = 0; i < 3; i++) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.18, 1.6), M.navy);
      d.position.set(0, 3.0, -1.4 + i * 1.4);
      d.rotation.x = -0.42; d.castShadow = true;
      g.add(d);
      caja(g, [5.6, 0.62, 0.06], [0, 2.6, -0.72 + i * 1.4], M.celesteSuave, false);
    }
    for (let i = 0; i < 3; i++) caja(g, [0.06, 1.7, 0.95], [2.83, 0, -1.3 + i * 1.3], M.navy, false);
    caja(g, [1.6, 1.2, 0.06], [-1.5, 0.6, 2.13], M.celeste, false);
    return 4.2;
  },
  base(g) {
    caja(g, [4, 0.5, 4], [0, 0, 0], M.navy);
    caja(g, [3.4, 3.0, 3.4], [0, 0.5, 0], M.blanco);
    ventanas(g, [3.4, 3.4], 0.5, 3, 0.95, 0, 0);
    const banda = caja(g, [3.5, 0.32, 3.5], [0, 3.5, 0], M.verde, false);
    banda.userData.sinArista = true;
    caja(g, [3.7, 0.25, 3.7], [0, 3.82, 0], M.navy);
    caja(g, [0.08, 2.2, 0.08], [-1.2, 4.07, -1.2], M.navy);
    const bandera = caja(g, [0.9, 0.55, 0.04], [-0.74, 5.65, -1.2], M.verde, false);
    bandera.userData.sinArista = true;
    return 4.4;
  },
  ayuntamiento(g) {
    caja(g, [5.4, 0.5, 4], [0, 0, 0], M.navy);
    caja(g, [4.8, 2.8, 3.2], [0, 0.5, -0.2], M.muro);
    for (let i = -2; i <= 2; i++) caja(g, [0.34, 2.8, 0.34], [i * 1.1, 0.5, 1.65], M.blanco);
    caja(g, [5.2, 0.4, 3.9], [0, 3.3, 0], M.navy);
    caja(g, [1.6, 2.4, 1.6], [0, 3.7, -0.6], M.navyClaro);
    caja(g, [0.9, 0.9, 0.06], [0, 4.6, 0.23], M.celeste, false);
    caja(g, [1.8, 0.3, 1.8], [0, 6.1, -0.6], M.navy);
    return 7.2;
  },
};

export function createRobot(libre = false) {
  const g = new THREE.Group();
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24),
    new THREE.MeshBasicMaterial({color: C.navy, transparent: true, opacity: 0.14}));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.17; sombra.userData.sinArista = true;
  g.add(sombra);
  const cuerpo = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.42, 6, 16), libre ? M.celesteSuave : M.blanco);
  torso.position.y = 0.72; torso.castShadow = true;
  if (libre) {
    const chaleco = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.16, 20), M.verde);
    chaleco.position.y = 0.82; chaleco.userData.sinArista = true;
    g.add(chaleco);
  }
  const cabeza = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.5), M.navy);
  cabeza.position.y = 1.42; cabeza.castShadow = true;
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.04), M.verde);
  visor.position.set(0, 1.44, 0.26); visor.userData.sinArista = true;
  const antena = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), M.verde);
  antena.position.y = 1.78; antena.userData.sinArista = true;
  cuerpo.add(torso, cabeza, visor, antena);
  if (libre) { const ch = g.children[g.children.length - 1]; g.remove(ch); cuerpo.add(ch); }
  g.add(cuerpo);
  const anillo = new THREE.Mesh(new THREE.RingGeometry(0.66, 0.8, 40), M.verde);
  anillo.rotation.x = -Math.PI / 2; anillo.position.y = 0.19; anillo.visible = false; anillo.userData.sinArista = true;
  const giro = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.035, 6, 48, Math.PI * 1.3), M.verde);
  giro.rotation.x = -Math.PI / 2; giro.position.y = 0.3; giro.visible = false; giro.userData.sinArista = true;
  g.add(anillo, giro);
  g.rotation.y = Math.PI / 4;
  g.scale.setScalar(1.3);
  g.userData.partes = {cuerpo, anillo, giro, visor};
  return g;
}


export const BUILDING_TYPES = Object.freeze(Object.keys(EDIFICIOS));
export function createBuilding(type) {
 if (!Object.hasOwn(EDIFICIOS, type)) throw new Error('Unknown building shape');
 const group = new THREE.Group();
 const height = EDIFICIOS[type](group);
 return {group, height};
}
