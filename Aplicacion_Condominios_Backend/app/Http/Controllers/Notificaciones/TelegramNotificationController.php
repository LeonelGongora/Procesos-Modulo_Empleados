<?php

namespace App\Http\Controllers\Notificaciones;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use skrtdev\NovaGram\Bot;

class TelegramNotificationController extends Controller
{
    public function sendNoticeToOne(Request $request)
    {
        try {
            $this->sendMessage($request->chat_id, $request->text);

            return response()->json(['message' => 'Notificacion enviada exitosamente'], 200);
        } catch (\Exception $err) {
            return response()->json([
                'message' => $err->getMessage()
            ], 500);
        }
    }

    private function sendMessage($chatId, $messageText)
    {
        $bot = new Bot(env('TELEGRAM_BOT_TOKEN'), [
            'disable_ip_check' => true,
            'disable_auto_webhook_set' => true
        ]);

        $bot->sendMessage($chatId, $messageText);
    }

    public function sendNoticeToMany(Request $request)
    {
        $currentChatId = -1;

        try {
            $messageText = $request->input('text');
            $chatIds = $request->input('chat_ids');

            foreach ($chatIds as $chatId) {
                $currentChatId = $chatId;
                $this->sendMessage($chatId, $messageText);
            }

            return response()->json(['message' => 'Notificaciones enviadas exitosamente'], 200);
        } catch (\Exception $err) {
            return response()->json([
                'chat_id' => $currentChatId,
                'message' => $err->getMessage()
            ], 500);
        }
    }
}
