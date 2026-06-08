const db = require('./src/config/db');

async function limpiarBaseDatos() {
    try {
        console.log('Iniciando limpieza de base de datos...');
        
        // Limpiar pedidos (también limpia detalle_pedidos por cascada)
        const [result1] = await db.query('DELETE FROM pedidos');
        console.log(`✓ Pedidos eliminados: ${result1.affectedRows} registros`);
        
        // Restaurar mesas a estado libre
        const [result2] = await db.query('DELETE FROM mesas');
        console.log(`✓ Mesas eliminadas: ${result2.affectedRows} registros`);
        
        const [result3] = await db.query(`
            INSERT INTO mesas (numero_mesa) 
            VALUES ('Mesa 1'), ('Mesa 2'), ('Mesa 3'), ('Mesa 4'), ('Mesa 5')
        `);
        console.log(`✓ Mesas restauradas: ${result3.affectedRows} registros`);
        
        console.log('\n✅ Base de datos limpiada exitosamente!');
        console.log('   - Pedidos eliminados');
        console.log('   - Detalles de pedidos eliminados');
        console.log('   - Mesas restauradas');
        console.log('   - Productos y categorías mantienen sus datos');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al limpiar la base de datos:', error);
        process.exit(1);
    }
}

limpiarBaseDatos();
