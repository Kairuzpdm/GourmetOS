const db = require('./src/config/db');

async function analizarFlujo() {
    try {
        console.log('\n🔍 ANÁLISIS COMPLETO DEL FLUJO DE PEDIDOS\n');
        console.log('════════════════════════════════════════\n');

        // 1. Ver todas las mesas
        const [mesas] = await db.query('SELECT * FROM mesas');
        console.log('📍 MESAS:');
        console.log(`Total: ${mesas.length}`);
        mesas.forEach(m => {
            console.log(`  - Mesa ${m.id}: ${m.numero_mesa} (${m.estado})`);
        });
        console.log();

        // 2. Ver todos los pedidos
        const [pedidos] = await db.query(`
            SELECT p.id, p.mesa_id, m.numero_mesa, p.usuario_id, p.estado, p.total, p.creado_en
            FROM pedidos p
            LEFT JOIN mesas m ON p.mesa_id = m.id
            ORDER BY p.id DESC
        `);
        console.log('📋 TODOS LOS PEDIDOS:');
        console.log(`Total: ${pedidos.length}`);
        if (pedidos.length > 0) {
            pedidos.forEach(p => {
                console.log(`  - Pedido ${p.id}: Mesa ${p.numero_mesa} | Estado: ${p.estado} | Total: Bs ${p.total}`);
            });
        } else {
            console.log('  ❌ NO HAY PEDIDOS');
        }
        console.log();

        // 3. Ver pedidos activos (para cocina)
        const [activos] = await db.query(`
            SELECT p.id, m.numero_mesa, p.estado, p.creado_en
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado IN ('pendiente', 'preparacion', 'listo')
            ORDER BY p.creado_en ASC
        `);
        console.log('🍳 PEDIDOS ACTIVOS (para Cocina):');
        console.log(`Total: ${activos.length}`);
        if (activos.length > 0) {
            activos.forEach(p => {
                console.log(`  - Pedido ${p.id}: ${p.numero_mesa} | ${p.estado}`);
            });
        } else {
            console.log('  ℹ️ Sin pedidos activos');
        }
        console.log();

        // 4. Ver pedidos por cobrar (para cajero)
        const [porcobrar] = await db.query(`
            SELECT p.id, m.numero_mesa, m.id as mesa_id, p.estado, p.total, p.creado_en
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado IN ('listo', 'entregado')
            ORDER BY p.creado_en ASC
        `);
        console.log('💰 PEDIDOS POR COBRAR (para Cajero):');
        console.log(`Total: ${porcobrar.length}`);
        if (porcobrar.length > 0) {
            porcobrar.forEach(p => {
                console.log(`  - Pedido ${p.id}: ${p.numero_mesa} | ${p.estado} | Bs ${p.total}`);
            });
        } else {
            console.log('  ❌ NO HAY PEDIDOS LISTOS (Cajero verá vacío)');
        }
        console.log();

        // 5. Ver detalles de pedidos
        const [detalles] = await db.query(`
            SELECT dp.id, dp.pedido_id, dp.cantidad, pr.nombre, dp.precio_unitario
            FROM detalle_pedidos dp
            JOIN productos pr ON dp.producto_id = pr.id
            ORDER BY dp.pedido_id DESC
        `);
        console.log('📦 DETALLES DE PEDIDOS:');
        console.log(`Total: ${detalles.length}`);
        if (detalles.length > 0) {
            let pedidoActual = null;
            detalles.forEach(d => {
                if (d.pedido_id !== pedidoActual) {
                    pedidoActual = d.pedido_id;
                    console.log(`\n  Pedido ${d.pedido_id}:`);
                }
                console.log(`    - ${d.cantidad}x ${d.nombre} (Bs ${d.precio_unitario})`);
            });
        } else {
            console.log('  ℹ️ Sin detalles de pedidos');
        }
        console.log();

        console.log('════════════════════════════════════════\n');
        console.log('📝 RESUMEN:');
        console.log(`✓ Mesas disponibles: ${mesas.length}`);
        console.log(`✓ Pedidos totales: ${pedidos.length}`);
        console.log(`✓ Pedidos activos (Cocina): ${activos.length}`);
        console.log(`✓ Pedidos para cobrar (Cajero): ${porcobrar.length}`);
        
        if (porcobrar.length === 0 && activos.length > 0) {
            console.log('\n⚠️  PROBLEMA: Hay pedidos activos pero NINGUNO está en estado "listo"');
            console.log('   → Asegúrate de marcar pedidos como "Listo" en Cocina');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

analizarFlujo();
