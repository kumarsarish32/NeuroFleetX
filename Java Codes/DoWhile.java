import java.util.Scanner;

public class DoWhileExample {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        do {
            System.out.print(n + " ");
            n--;
        } while (n > 0);
    }
}
