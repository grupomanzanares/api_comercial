// controllers/lotteryParticipationsController.js
import {
    LotteryParticipation,
    Lottery,
    Subscriber,
} from '../index.js'; // <-- importe desde el index

const getPendingMessages = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 100;
        const offset = Number(req.query.offset) || 0;

        const rows = await LotteryParticipation.findAll({
            where: {
                message: false,   // TINYINT(1) ↔ BOOLEAN
                // status: true,  // descomente si necesita este filtro también
            },
            attributes: [
                'id', 'date', 'code', 'status', 'message',
                'createdAt', 'updatedAt',
                'lotteryId', 'subscriberId',
            ],
            include: [
                { model: Lottery, as: 'lottery', attributes: ['id', 'name', 'startDate', 'endDate'] },
                { model: Subscriber, as: 'subscriber', attributes: ['identification', 'name', 'phone'] },
            ],
            order: [['date', 'ASC']],
            limit,
            offset,
        });

        res.json({
            success: true,
            message: 'Registros pendientes de envío obtenidos correctamente',
            total: rows.length,
            data: rows,
        });
    } catch (error) {
        console.error('❌ Error al obtener registros pendientes:', error);
        res.status(500).json({ success: false, message: 'Error al consultar la base de datos', error: error.message });
    }
};



/** GET /lottery-participations/code/:code  */
const getByCode = async (req, res) => {
    try {
        const raw = (req.params.code || '').trim();
        if (!raw) return res.status(400).json({ success: false, message: 'Falta el parámetro :code' });

        const code = raw.toUpperCase(); // normalice si sus códigos se guardan en mayúscula

        const row = await LotteryParticipation.findOne({
            where: { code },
            attributes: [
                'id', 'date', 'code', 'status', 'message',
                'createdAt', 'updatedAt', 'lotteryId', 'subscriberId'
            ],
            include: [
                { model: Lottery, as: 'lottery', attributes: ['id', 'name', 'startDate', 'endDate'] },
                { model: Subscriber, as: 'subscriber', attributes: ['identification', 'name', 'phone'] }
            ]
        });

        if (!row) {
            return res.status(404).json({ success: false, message: 'Código no encontrado', code });
        }

        // metadatos útiles opcionales (vigencia de la promo)
        const now = new Date();
        const start = row.lottery?.startDate ? new Date(row.lottery.startDate) : null;
        const end = row.lottery?.endDate ? new Date(row.lottery.endDate) : null;
        const lotteryActive =
            (!!start ? now >= start : true) &&
            (!!end ? now <= end : true);

        res.json({
            success: true,
            message: 'Código consultado correctamente',
            data: row,
            meta: { code, lotteryActive, now }
        });
    } catch (error) {
        console.error('❌ Error getByCode:', error);
        res.status(500).json({ success: false, message: 'Error al consultar la base de datos', error: error.message });
    }
};

// Exportaciones nombradas para usarlas desde el archivo de rutas
exp

export {
    getPendingMessages,
    getByCode
}