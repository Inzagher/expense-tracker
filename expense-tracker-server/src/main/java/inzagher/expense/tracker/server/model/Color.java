package inzagher.expense.tracker.server.model;

import inzagher.expense.tracker.server.dto.ColorDTO;
import javax.persistence.Embeddable;

@Embeddable
public class Color {
    private byte red;
    private byte green;
    private byte blue;
    
    public Color(byte red, byte green, byte blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    
    public Color() {
    }

    public byte getRed() {
        return red;
    }

    public void setRed(byte red) {
        this.red = red;
    }

    public byte getGreen() {
        return green;
    }

    public void setGreen(byte green) {
        this.green = green;
    }

    public byte getBlue() {
        return blue;
    }

    public void setBlue(byte blue) {
        this.blue = blue;
    }
    
    public ColorDTO toDTO() {
        ColorDTO dto = new ColorDTO();
        dto.setRed(red);
        dto.setGreen(green);
        dto.setBlue(blue);
        return dto;
    }
}
