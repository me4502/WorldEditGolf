import { WebGLRenderer, Texture, PerspectiveCamera, DirectionalLightHelper, Object3D, PlaneGeometry, MeshPhongMaterial, DirectionalLight, Color, CylinderGeometry, OrthographicCamera, NearestFilter, TextureLoader, MeshBasicMaterial, Scene, Mesh, BoxGeometry, MeshNormalMaterial, AmbientLight, Material } from 'three';
import { decode, Tag, Short } from './nbt-ts';
import { unzip } from 'gzip-js';

//const camera = new OrthographicCamera()
//const camera = new PerspectiveCamera(70, 500 / 500, 0.01, 10);

const needsColorBlocks = new Set([
    "birch_leaves",
    "dark_oak_leaves",
    "grass_block_top",
    "spruce_leaves",
    "oak_leaves",
    "jungle_leaves",
    "acacia_leaves"
]);
const materialCache = new Map<string, Material>();
const loader = new TextureLoader();
const blockSideGeometry = new PlaneGeometry(1, 1, 1, 1);

type IsAdjacentEmpty = (x: number, y: number, z: number) => boolean;

function getTextureMaterial(tex: string): Material {
    const cached = materialCache.get(tex);
    if (cached) return cached;

    const needsColor = needsColorBlocks.has(tex);
    const texture = loader.load(`/static/textures/${tex}.png`);
    texture.magFilter = NearestFilter;
    //texture.minFilter = NearestFilter;
    const mat = new MeshPhongMaterial({
        map: texture,
        color: needsColor ? new Color(0x91bd59) : new Color(),
        shininess: 0,
    });
    materialCache.set(tex, mat);
    return mat;
}

function multiBlockGen(top: string, bottom: string, left: string, right: string, back: string, front: string): (f: IsAdjacentEmpty) => Object3D {   
    return f => {
        const scene = new Scene();

        if (f(0, 1, 0)) {
            const topMesh = new Mesh(blockSideGeometry, getTextureMaterial(top));
            topMesh.rotation.x = -Math.PI / 2;
            topMesh.position.y = 0.5;
            scene.add(topMesh);
        }

        if (f(0, -1, 0)) {
            const bottomMesh = new Mesh(blockSideGeometry, getTextureMaterial(bottom));
            bottomMesh.rotation.x = Math.PI / 2;
            bottomMesh.position.y = -0.5;
            scene.add(bottomMesh);
        }

        if (f(-1, 0, 0)) {
            const leftMesh = new Mesh(blockSideGeometry, getTextureMaterial(left));
            leftMesh.rotation.y = -Math.PI / 2;
            leftMesh.position.x = -0.5;
            scene.add(leftMesh);
        }

        if (f(1, 0, 0)) {
            const rightMesh = new Mesh(blockSideGeometry, getTextureMaterial(right));
            rightMesh.rotation.y = Math.PI / 2;
            rightMesh.position.x = 0.5;
            scene.add(rightMesh);
        }

        if (f(0, 0, -1)) {
            const backMesh = new Mesh(blockSideGeometry, getTextureMaterial(back));
            backMesh.rotation.y = Math.PI;
            backMesh.position.z = -0.5;
            scene.add(backMesh);
        }

        if (f(0, 0, 1)) {
            const frontMesh = new Mesh(blockSideGeometry, getTextureMaterial(front));
            frontMesh.position.z = 0.5;
            scene.add(frontMesh);
        }

        //scene.add(topMesh, bottomMesh, leftMesh, rightMesh, frontMesh, backMesh);
        
        return scene;
    };
}

function sideBlockGen(top: string, bottom: string, side: string): (f: IsAdjacentEmpty) => Object3D {
    return multiBlockGen(top, bottom, side, side, side, side);
}

function basicBlockGen(material: string): (f: IsAdjacentEmpty) => Object3D {
    return sideBlockGen(material, material, material);
}

const blockNameMap = {
    "acacia_door": basicBlockGen("acacia_door_top"),
    "barrel": sideBlockGen("barrel_top", "barrel_bottom", "barrel_side"),
    "birch_door": basicBlockGen("birch_door_top"),
    "bone_block": sideBlockGen("bone_block_top", "bone_block_top", "bone_block_side"),
    "cake": basicBlockGen("cake_top"),
    "cartography_table": multiBlockGen("cartography_table_top", "cartography_table_side3", "cartography_table_side1", "cartography_table_side2", "cartography_table_side3", "cartography_table_side3"),
    "cauldron": sideBlockGen("cauldron_top", "cauldron_bottom", "cauldron_side"),
    "composter": sideBlockGen("composter_top", "composter_bottom", "composter_side"),
    "crafting_table": multiBlockGen("crafting_table_top", "oak_planks", "crafting_table_side", "crafting_table_side", "crafting_table_side", "crafting_table_front"),
    "dispenser": basicBlockGen("dispenser_front"),
    "dried_kelp": basicBlockGen("dried_kelp_top"),
    "dropper": basicBlockGen("dropper_front"),
    "fletching_table": basicBlockGen("fletching_table_front"),
    "frosted_ice": basicBlockGen("frosted_ice_0"),
    "furnace": basicBlockGen("furnace_front"),
    "grass_block": sideBlockGen("grass_block_top", "dirt", "grass_block_side"),
    "hopper": basicBlockGen("hopper_outside"),
    "iron_door": basicBlockGen("iron_door_top"),
    "jukebox": basicBlockGen("jukebox_top"),
    "lectern": basicBlockGen("lectern_front"),
    "loom": basicBlockGen("loom_front"),
    "mycelium": basicBlockGen("mycelium_top"),
    "oak_door": basicBlockGen("oak_door_top"),
    "observer": basicBlockGen("observer_front"),
    "quartz_block": basicBlockGen("quartz_block_side"),
    "scaffolding": basicBlockGen("scaffolding_top"),
    "smithing-table": basicBlockGen("smithing_table_front"),
    "smoker": basicBlockGen("smoker_front"),
    "smooth_stone_slab": basicBlockGen("smooth_stone_slab_side"),
    "stone_slab": basicBlockGen("stone_slab_side"),
    "tnt": basicBlockGen("tnt_side")
};

//const testSchematic = "H4sIAAAAAAAAAF1OwWrCQBCdZGliVjz33i/wLOhBKvRQaaFQq1JkXCfJYNxAdqDttT/aT2lntVTpXB7z3sx7z0Lx5Go6oLAzYB+xIRGa4zsAGAv5L2FgcGBPrsNSRsidqomB6zPncE/rLQuF8fBV1dTAzVmtOgxhs21at18H3759jEtsAsVDjYH8mbrArY9/KWT35CupIbXQm5PgDgUNFIvZQ1kGkpdvnYt9+W9fHU3V5o64qiU26d+qxV9GtsmhmMYukdbbXnxIkiQtYHDkZ15YmII9OV0teBf79CE7RcTSGvqlOFH8hB/BmInqRgEAAA==";
//const testSchematic = "H4sIAAAAAAAAAF2O3UrDQBCFj1lskrXFd/AxBL0QC15YLFSsP4iM6SQZTDeQHdDe9kV9FJ2tQsVzc5gzw3fGo1xULa9JpXLwc+pYlWf0AcB55L+Bw/FaAlcD1XoatQ9s+wOHyT4lGSzLHE72WTNQjC+vXV+9PcXQv2/OauoiPyPJIb/jIUofEivD6JpDoy0yj2LGSitSciiX05u6jqz3X6Y/88O/+XEHNcwVS9MqshzlRWq+NI5tCuxqTDhcyioVlRjfSsfToKLC0aeLI4x+eOlDa/g0Pzff4hs2pFkvKwEAAA==";
const testSchematic = "H4sIAAAAAAAAAO3aQW7TQBTG8bENLQkgNogNV+AELBGVWFAVCdQCm8okk8YidVAyC27BQbgAEifgEGyQOERXxWnjetygLur3rBnl/y2aOol+erKenzIeD83g7WhqT3NXjDIzfJPPrHN2P/9qjLkzNLvrNzLz5LQo7WiRT9zzhR0fj+blaGGdrb6WZeZx82GxmJfHn2bz0efqozQzD5uP8mJhVt83T5v3vsxnxXJagXk5tsviAkyqr+we2sWymJerw9TsvLbliZuaR0Nzb9+6fJy7PDODo72DyWRp3fvz8/Pv3vGH6vivd/yxOj4zFfPKFidTZ57tmsGLVYkvK8eY3z+MTpJWUFFRUaXUmBLTeUVFRY1JVUmSaBSLioqKioqKiooal5p6QUVFRUVFRUVF3U61zgUqWGvi/UFFRUUNW20NwsBrRUVFRdWchOtBKKfWP11la0VFRUXVUf1BKKiuyLpeVFRU1NBVbxAGvuZGRUVFVVObQRj4Ez+oqKioWqo3CIOvFRUVFVVF9QehQq0K+9yoqKiowmrqReUpRVRUVNTQVX8Qajybo3CnFBUVFVVHrSOp1rvcqKhJkl0mve3fy39iPgOo4au1LbwPU3nStcaqdpsC/hzYUDuwN6kSM+s/asf0WavKeRXvAZ1+3U61mbHy+zDCtfagdmzXpl831O5BRe2nX3WurcBVbw5K7sOsXdFa+1A7ttRVZ22oAkFF7adfda6tsNV6DkYxtfv5TSjSWXH/ykCNSFXoV51rK3A1qpX8tfsuMj3Q3/0sVNRYVIVrS2cOiKlqa+6Y9oxae5xCPXBNFQgqaj/9qnNtha3qrbnl7z72oUp2VksVCCpqP/2qc20Friruw9TVxqTevqmu7cVtqN2DitpPv+pcW6GrOiv5plpUyWfJNtQO7E3q7dkb1Y7ps1aV8yreAzr9uq2qzkq+CSqq/MyK7QygxqAKr7lTP6ioqKiBq0l7FkqpOrWioqKi6qj+LJTfhxH+/YqKioqqo7Yip/rFoqKiooau+hFUvWJRUVFRg1c9WVJtikVFRUUNXV2Z65uPsvP1qlhUVFTUwNV6C0bh2ce6WFRUVNSw1ashqPEUuMKaGxUVFVVeVZ2EicKaGxUVFVVcTb2goqKiouqoKSoqKmrgM6sdVFRUVFRUVFTU7VOVolMqKioqakyJ6byioqLGpBJCCFFJau4eFWM3NYcD8+BdMbN7pStcYZfD1af3zc7BZLK0rvo/S379/FO9Hlev38w//swLQvbeAAA=";

function parseNbt(nbt: string): Tag {
    const buff = Buffer.from(nbt, 'base64');
    const deflated = Buffer.from(unzip(buff));
    const data = decode(deflated, true, 0, true);
    return {[data.name]: [data.value]};
}

function buildSceneFromSchematic(tag: Tag, scene: Scene): [number, number, number] {
    const blocks = (tag as any).get("BlockData") as Buffer;
    const width = ((tag as any).get("Width") as Short).value;
    const height = ((tag as any).get("Height") as Short).value;
    const length = ((tag as any).get("Length") as Short).value;

    const palette = new Map<number, string>();
    for (let [key, value] of (tag as any).get("Palette").entries()) {        
        // sanitize the block name
        let colonIndex = key.indexOf(':');
        if (colonIndex !== -1) {
            key = key.substring(colonIndex + 1);
        }

        let bracketIndex = key.indexOf('[');
        if (bracketIndex !== -1) {
            key = key.substring(0, bracketIndex);
        }
        
        palette.set(value.value, key);
    }

    const blockMap = new Map<string, string>();
    let index = 0;
    let i = 0;
    while (i < blocks.length) {
        let value = 0;
        let varintLength = 0;

        while (true) {
            value |= (blocks[i] & 127) << (varintLength++ * 7);
            if (varintLength > 5) {
                throw new Error("VarInt too big");
            }
            if ((blocks[i] & 128) != 128) {
                i++;
                break;
            }
            i++;
        }

        let y = Math.floor(index / (width * length));
        let z = Math.floor((index % (width * length)) / width);
        let x = (index % (width * length)) % width;

        index++;

        const blockName = palette.get(value);
        if (blockName === 'air') {
            continue;
        }

        blockMap.set(`${x},${y},${z}`, blockName);
    }

    for (const [pos, blockName] of blockMap.entries()) {
        const [xStr, yStr, zStr] = pos.split(',');
        const [x, y, z] = [parseInt(xStr), parseInt(yStr), parseInt(zStr)];

        const meshFunc = blockNameMap[blockName] || basicBlockGen(blockName);
        const mesh = meshFunc((xOffset, yOffset, zOffset) => {
            return !blockMap.has(`${x+xOffset},${y+yOffset},${z+zOffset}`);
        });
        mesh.position.x = -width/2 + x + 0.5;
        mesh.position.y = -height/2 + y + 0.5;
        mesh.position.z = -length/2 + z + 0.5;
        scene.add(mesh);
    }

    return [width, height, length];
}

export function renderSchematic(canvas: HTMLCanvasElement, schematic: string): () => void {
    const scene = new Scene();
    let hasDestroyed = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const mousedownCallback = (e: MouseEvent) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        e.preventDefault();
    };
    const mousemoveCallback = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        scene.rotation.y += deltaX / 100;
        scene.rotation.x += deltaY / 100;

        e.preventDefault();
    };
    const mouseupCallback = () => {
        isDragging = false;
    };

    const rootTag = parseNbt(testSchematic);
    const [worldWidth, worldHeight, worldLength] = buildSceneFromSchematic((rootTag as any).Schematic[0], scene);
    const cameraOffset = Math.max(worldWidth, worldLength) / 2 + 1;
    const camera = new OrthographicCamera(-cameraOffset, cameraOffset, cameraOffset, -cameraOffset, 0.01, 10000);
    camera.position.z = cameraOffset * 5;
    camera.position.y = cameraOffset / 2 * 5;
    camera.lookAt(0, 0, 0);

    const arrowMaterial = new MeshBasicMaterial({ color: new Color(0x000000) });
    const arrowGeometry = new CylinderGeometry(cameraOffset / 4, cameraOffset / 4, cameraOffset / 200, 3, 1, false);
    const arrowMesh = new Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.position.z = cameraOffset - 0.5;
    scene.add(arrowMesh);

    const worldLight = new DirectionalLight(0xffffff, 1);
    worldLight.position.x = cameraOffset;
    worldLight.position.z = cameraOffset;
    worldLight.position.y = cameraOffset;
    scene.add(worldLight);
    scene.add(new AmbientLight(new Color(), 0.5));

    const gridGeom = new CylinderGeometry(cameraOffset / 400, cameraOffset / 400, 1, 3, 1, false);
    const gridMaterial = new MeshBasicMaterial({ color: new Color(0x000000), opacity: 0.3, transparent: true });

    // generate a 3d grid
    for (let x = -worldWidth / 2; x <= worldWidth / 2; x++) {
        for (let y = -worldHeight / 2; y <= worldHeight / 2; y++) {
            const barMesh = new Mesh(gridGeom, gridMaterial);
            barMesh.scale.y = worldLength * 2;
            barMesh.rotation.x = Math.PI / 2;
            barMesh.position.x = x;
            barMesh.position.y = y;
            scene.add(barMesh);
        }
    }
    for (let z = -worldLength / 2; z <= worldLength / 2; z++) {
        for (let y = -worldHeight / 2; y <= worldHeight / 2; y++) {
            const barMesh = new Mesh(gridGeom, gridMaterial);
            barMesh.scale.y = worldWidth * 2;
            barMesh.rotation.z = Math.PI / 2;
            barMesh.position.z = z;
            barMesh.position.y = y;
            scene.add(barMesh);
        }
    }
    for (let x = -worldWidth / 2; x <= worldWidth / 2; x++) {
        for (let z = -worldLength / 2; z <= worldLength / 2; z++) {
            const barMesh = new Mesh(gridGeom, gridMaterial);
            barMesh.scale.y = worldHeight * 2;
            barMesh.position.x = x;
            barMesh.position.z = z;
            scene.add(barMesh);
        }
    }
    
    const renderer = new WebGLRenderer({ antialias: true, canvas });
    renderer.setClearColor(new Color(0xFFFFFF));
    renderer.setSize(500, 500);

    canvas.addEventListener('mousedown', mousedownCallback);
    document.body.addEventListener('mousemove', mousemoveCallback);
    document.body.addEventListener('mouseup', mouseupCallback);

    let lastTime = performance.now();
    function render() {
        if (hasDestroyed) return;

        requestAnimationFrame(render);

        const nowTime = performance.now();
        const deltaTime = nowTime - lastTime;
        lastTime = nowTime;
        if (!isDragging) {
            scene.rotation.y += deltaTime / 4000;
        }

        renderer.render(scene, camera);
    }
    render();

    return () => {
        hasDestroyed = true;
        canvas.removeEventListener('mousedown', mousedownCallback);
        document.body.removeEventListener('mousemove', mousemoveCallback);
        document.body.removeEventListener('mouseup', mouseupCallback);
    };
}
