package com.digitalbooking.service;

import com.digitalbooking.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String username) {
        String subject = "Confirmación de Registro en Digital Booking";
        String body = "Hola " + username + ",\n\n"
                + "¡Te has registrado exitosamente en Digital Booking!\n\n"
                + "Tu nombre de usuario es: " + toEmail + "\n"
                + "Ya puedes iniciar sesión en tu cuenta en el siguiente enlace: http://localhost:5173/login\n\n"
                + "¡Sentite como en tu hogar!\n"
                + "El equipo de Digital Booking";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("no-reply@digitalbooking.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("EmailService: Correo electrónico de confirmación enviado exitosamente a " + toEmail);
                return;
            } catch (Exception e) {
                System.err.println("EmailService: Falló el envío de correo real: " + e.getMessage());
            }
        }

        // Fallback simulation log
        System.out.println("\n------------------------------------------------------------");
        System.out.println(">>> [EMAIL SIMULACIÓN] REGISTRO DE USUARIO <<<");
        System.out.println("Para: " + toEmail);
        System.out.println("Asunto: " + subject);
        System.out.println("Mensaje:\n" + body);
        System.out.println("------------------------------------------------------------\n");
    }

    public void sendBookingConfirmationEmail(Booking booking) {
        String toEmail = booking.getUser() != null ? booking.getUser().getEmail() : "usuario@ejemplo.com";
        String userName = booking.getUser() != null ? (booking.getUser().getFirstName() + " " + booking.getUser().getLastName()) : "Huésped";
        String subject = "Confirmación de Reserva en Digital Booking - " + booking.getProduct().getName();
        
        String cleanProductName = booking.getProduct().getName().toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
        String body = "Hola " + userName + ",\n\n"
                + "¡Tu reserva ha sido confirmada con éxito!\n\n"
                + "Detalles de la Reserva:\n"
                + "• Alojamiento: " + booking.getProduct().getName() + "\n"
                + "• Categoría: " + (booking.getProduct().getCategory() != null ? booking.getProduct().getCategory().getTitle() : "N/A") + "\n"
                + "• Ubicación: " + booking.getProduct().getLocation() + "\n"
                + "• Período: desde " + booking.getStartDate() + " hasta " + booking.getEndDate() + "\n"
                + (booking.getEstimatedArrivalTime() != null ? "• Horario estimado de llegada: " + booking.getEstimatedArrivalTime() + "\n" : "")
                + "\nInformación de contacto del proveedor:\n"
                + "• Email de contacto: contacto@" + cleanProductName + ".com\n"
                + "• Teléfono de atención: +54 9 11 2233-4455\n\n"
                + "Instrucciones de check-in:\n"
                + "Por favor presenta tu DNI o documento identificatorio y el correo de confirmación impreso o digital al momento de la llegada.\n\n"
                + "¡Te deseamos una feliz estadía!\n"
                + "El equipo de Digital Booking";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("no-reply@digitalbooking.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("EmailService: Correo electrónico de confirmación de reserva enviado exitosamente a " + toEmail);
                return;
            } catch (Exception e) {
                System.err.println("EmailService: Falló el envío de correo de reserva real: " + e.getMessage());
            }
        }

        // Fallback simulation log
        System.out.println("\n------------------------------------------------------------");
        System.out.println(">>> [EMAIL SIMULACIÓN] CONFIRMACIÓN DE RESERVA <<<");
        System.out.println("Para: " + toEmail);
        System.out.println("Asunto: " + subject);
        System.out.println("Mensaje:\n" + body);
        System.out.println("------------------------------------------------------------\n");
    }
}
