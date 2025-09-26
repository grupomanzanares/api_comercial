// controllers/lotteryParticipationsController.js
import {
    LotteryParticipation,
    Lottery,
    Subscriber,
} from '../../models/index.js'; // <-- importe desde el index

export const getPendingMessages = async (req, res) => {
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
                { model: Subscriber, as: 'subscriber', attributes: ['id', 'name', 'email', 'phone'] },
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
